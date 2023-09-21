import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

export interface Validator {
  moniker: string;
  pubkey: string;
  stake: string;
}

export interface GetValidatorsResponse {
  validators: Validator[];
}

export async function getValidators(): Promise<Validator[]> {
  const response = await fetch(`${API_URL}/v1/validator`);
  const { validators } = (await response.json()) as GetValidatorsResponse;

  return validators;
}

export async function getLatestHeight() {
  const response = await fetch(`${API_URL}/v1/block_range`);
  const data = await response.json();

  return parseInt(data.lastHeight);
}

export function useLatestHeightQuery() {
  return useQuery({
    queryKey: ["latest-height"],
    queryFn: async () => {
      return getLatestHeight();
    },
    keepPreviousData: true,
  });
}

export interface ValidatorStatsResponse {
  averageMev: string;
  validatorPubkey: string;
}

export async function getValidatorStats(fromHeight: number, toHeight: number) {
  try {
    const response = await fetch(
      `${API_URL}/v1/validator_stats?from_height=${fromHeight}&to_height=${toHeight}`
    );
    const data = await response.json();

    return data.validatorStats.reduce(
      (acc: Record<string, string>, item: ValidatorStatsResponse) => {
        acc[item.validatorPubkey] = item.averageMev;
        return acc;
      },
      {}
    );
  } catch {
    return [
      {
        averageMev: "0",
        validatorPubkey: "",
      },
    ];
  }
}

interface Datapoint {
  value: number;
  proposer: string;
  height: string;
  probability: number;
}

interface CumulativeDatapoint {
  height: string;
  value: number;
}

interface RawMEVRequest {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
  withBlockInfo?: boolean;
}

interface CumulativeMEVRequest {
  proposer: string;
  every: number;
  limit: number;
  probabilityThreshold: number;
}

export async function getRawMEV(params: RawMEVRequest) {
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

  if (params.withBlockInfo) {
    query.append("with_block_info", params.withBlockInfo.toString());
  }

  const response = await fetch(`${API_URL}/v1/raw_mev?${query.toString()}`);
  const data = await response.json();

  return data.datapoints as Datapoint[];
}

export async function getCumulativeMEV(params: CumulativeMEVRequest) {
  const response = await axios.get(`${API_URL}/v1/cumulative_mev?proposer=${params.proposer}&limit=${params.limit}&every=${params.every}&probabilityThreshold=${params.probabilityThreshold}`);

  return response.data.datapoints as CumulativeDatapoint[];
}

export function useValidatorsWithStatsQuery(blocks: number) {
  const { data: toHeight } = useLatestHeightQuery();
  const { data: validators } = useValidatorsQuery();
  return useQuery({
    queryKey: ["validators-with-stats", blocks],
    queryFn: async () => {
      if (!toHeight) return;
      if (!validators) return;

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const stats = await getValidatorStats(fromHeight, toHeight);

      return validators
        .map((validator) => ({
          ...validator,
          averageMev: stats[validator.pubkey] || 0,
        }))
        .sort((a, b) => parseFloat(b.averageMev) - parseFloat(a.averageMev));
    },
    enabled: !!toHeight && !!validators,
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

export function useRawMEVQuery(
  proposer: string,
  blocks: number,
  withBlockInfo: boolean
) {
  const { data: toHeight } = useLatestHeightQuery();
  return useQuery({
    queryKey: ["raw-mev", proposer, blocks],
    queryFn: async () => {
      if (!toHeight) return;

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      return getRawMEV({
        proposers: [proposer],
        from: fromHeight,
        to: toHeight,
        limit: 1000,
        withBlockInfo: withBlockInfo,
      });
    },
    enabled: proposer !== "" && !!toHeight,
  });
}

export function useCumulativeMEVQuery() {
  return useQuery({
    queryKey: ["cumulative-mev"],
    queryFn: async () => {
      const response = await fetch("/api/main-chart-data");
      const data = await response.json();

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

export function cumulativeDatapoints(
  datapoints: Datapoint[],
  probabilityThreshold: number
) {
  const reversedValues = [...datapoints].reverse();

  return reversedValues.map((_, index) => {
    return {
      key: reversedValues.length - index,
      value: reversedValues.slice(0, index + 1).reduce((acc, value) => {
        let discrepancy = value.value;
        if (value.probability > probabilityThreshold) {
          return acc + discrepancy;
        } else {
          return acc;
        }
      }, 0),
    };
  });
}
