import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// const API_URL = "http://localhost:8080";
const API_URL = "https://dydx-mev-api-dev.skip.money";

export interface Validator {
  moniker: string;
  pubkey: string;
  stake: string;
}

export interface GetValidatorsResponse {
  validators: Validator[];
}

export async function getValidators() {
  const response = await axios.get(`${API_URL}/v1/validator`);

  const { validators } = response.data as GetValidatorsResponse;

  return validators;
}

export async function getLatestHeight() {
  const response = await axios.get(`${API_URL}/v1/raw_mev?limit=1`);

  return parseInt(response.data.datapoints[0].height);
}

export interface ValidatorStats {
  averageMev: string;
  averageNormalizedMev: number;
  validatorPubkey: string;
}

export async function getValidatorStats(
  pubkey: string,
  fromHeight: number,
  toHeight: number
) {
  const response = await axios.get(
    `${API_URL}/v1/validator_stats?validator_pubkey=${pubkey}&from_height=${fromHeight}&to_height=${toHeight}`
  );

  return response.data.validatorStats as ValidatorStats;
}

interface Datapoint {
  value: number;
  proposer: string;
  height: string;
}

interface DatapointRequest {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
}

export async function getNormalizedMEV(params: DatapointRequest) {
  const query = new URLSearchParams();

  for (const proposer of params.proposers) {
    query.append("proposers", proposer);
  }

  if (params.from) {
    query.append("from_height", params.from.toString());
  }

  if (params.to) {
    query.append("to_height", params.to.toString());
  }

  if (params.limit) {
    query.append("limit", params.limit.toString());
  }

  const response = await axios.get(
    `${API_URL}/v1/normalized_mev?${query.toString()}`
  );

  return response.data.datapoints as Datapoint[];
}

export async function getRawMEV(params: DatapointRequest) {
  const query = new URLSearchParams();

  for (const proposer of params.proposers) {
    query.append("proposers", proposer);
  }
  if (params.from) {
    query.append("from_height", params.from.toString());
  }

  if (params.to) {
    query.append("to_height", params.to.toString());
  }

  if (params.limit) {
    query.append("limit", params.limit.toString());
  }

  const response = await axios.get(`${API_URL}/v1/raw_mev?${query.toString()}`);

  return response.data.datapoints as Datapoint[];
}

export function useValidatorsWithStatsQuery(blocks: number) {
  return useQuery({
    queryKey: ["validators-with-stats", blocks],
    queryFn: async () => {
      const validators = await getValidators();

      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const statPromises = validators.map((validator) =>
        getValidatorStats(validator.pubkey, fromHeight, toHeight)
      );

      const stats = await Promise.all(statPromises);

      return validators.map((validator, index) => ({
        ...validator,
        averageMev: stats[index].averageMev,
        averageNormalizedMev: stats[index].averageNormalizedMev,
      }));
    },
    keepPreviousData: true,
  });
}

export function useValidatorsQuery() {
  return useQuery({
    queryKey: ["validators"],
    queryFn: async () => {
      return getValidators();
    },
    keepPreviousData: true,
  });
}

export function useNormalizedMEVQuery(proposer: string, blocks: number) {
  return useQuery({
    queryKey: ["normalized-mev", proposer, blocks],
    queryFn: async () => {
      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      return getNormalizedMEV({
        proposers: [proposer],
        from: fromHeight,
        to: toHeight,
        limit: 1000,
      });
    },
    enabled: proposer !== "",
  });
}

export function useRawMEVQuery(proposer: string, blocks: number) {
  return useQuery({
    queryKey: ["raw-mev", proposer, blocks],
    queryFn: async () => {
      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      return getRawMEV({
        proposers: [proposer],
        from: fromHeight,
        to: toHeight,
        limit: 1000,
      });
    },
    enabled: proposer !== "",
  });
}

export function useCumulativeNormalizedMEVQuery() {
  return useQuery({
    queryKey: ["cumulative-normalized-mev"],
    queryFn: async () => {
      const validators = await getValidators();

      const allDatapoints = await getNormalizedMEV({
        proposers: validators.map((v) => v.pubkey),
        limit: validators.length * 1000,
      });

      const byValidator = allDatapoints.reduce((acc, datapoint) => {
        return {
          ...acc,
          [datapoint.proposer]: [...(acc[datapoint.proposer] ?? []), datapoint],
        };
      }, {} as Record<string, Datapoint[]>);

      return validators.map((validator) => {
        return {
          validator: validator.moniker,
          cumulativeNormalizedMEV: cumulativeDatapoints(
            byValidator[validator.pubkey] ?? []
          ),
        };
      });
    },
  });
}

export function cumulativeDatapoints(datapoints: Datapoint[]) {
  const reversedValues = [...datapoints].reverse();

  return reversedValues.map((_, index) => {
    return {
      key: reversedValues.length - index,
      value: reversedValues.slice(0, index + 1).reduce((acc, value) => {
        return acc + value.value * 10000;
      }, 0),
    };
  });
}
