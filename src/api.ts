import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://dydx-mev-api-dev.skip.money";
// const API_URL = "https://dydx-mev-api-prod.skip.money";

export interface Validator {
  moniker: string;
  pubkey: string;
  stake: string;
}

export interface GetValidatorsResponse {
  validators: Validator[];
}

export async function getValidators(): Promise<Validator[]> {
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
  validatorPubkey: string;
}

export async function getValidatorStats(
  pubkey: string,
  fromHeight: number,
  toHeight: number
) {
  try {
    const response = await axios.get(
      `${API_URL}/v1/validator_stats?validator_pubkey=${pubkey}&from_height=${fromHeight}&to_height=${toHeight}`
    );

    return response.data.validatorStats as ValidatorStats;
  } catch {
    return {
      averageMev: "0",
      validatorPubkey: pubkey,
    };
  }
}

interface Datapoint {
  value: number;
  proposer: string;
  height: string;
  probability: number;
}

interface DatapointRequest {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
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

export function useCumulativeMEVQuery() {
  return useQuery({
    queryKey: ["cumulative-mev"],
    queryFn: async () => {
      const { data } = await axios.get("/api/main-chart-data");

      return data as {
        validator: string;
        cumulativeMEV: {
          key: number;
          value: number;
        }[];
      }[];
    },
  });
}

export function cumulativeDatapoints(datapoints: Datapoint[]) {
  const reversedValues = [...datapoints].reverse();

  return reversedValues.map((_, index) => {
    return {
      key: reversedValues.length - index,
      value: reversedValues.slice(0, index + 1).reduce((acc, value) => {
        return acc + value.value;
      }, 0),
    };
  });
}
