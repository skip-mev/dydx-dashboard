import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";
import { useMemo } from "react";
import { fetcher } from "./lib/fetcher";
import {
  ApiBlockRangeResponse,
  ApiCumulativeMevResponse,
  ApiRawMevResponse,
  ApiValidatorResponse,
  ApiValidatorStatsResponse,
} from "./types/api";
import {
  Datapoint,
  MainChartData,
  Validator,
  ValidatorWithStats,
} from "./types/base";

export async function getValidators(): Promise<Validator[]> {
  const endpoint = `${API_URL}/v1/validator`;
  const { validators } = await fetcher<ApiValidatorResponse>(endpoint);

  return validators;
}

export async function getLatestHeight() {
  const endpoint = `${API_URL}/v1/block_range`;
  const data = await fetcher<ApiBlockRangeResponse>(endpoint);

  return parseInt(data.lastHeight);
}

export function useLatestHeightQuery() {
  const queryKey = useMemo(() => ["USE_LATEST_HEIGHT"] as const, []);
  return useQuery({
    queryKey,
    queryFn: async () => {
      return getLatestHeight();
    },
    keepPreviousData: true,
  });
}

export type GetValidatorStatsArgs = {
  fromHeight: number;
  toHeight: number;
};

export async function getValidatorStats(args: GetValidatorStatsArgs) {
  const record: Record<string, string> = {};

  try {
    const query = new URLSearchParams({
      from_height: args.fromHeight.toString(),
      to_height: args.toHeight.toString(),
    });

    const endpoint = `${API_URL}/v1/validator_stats?${query.toString()}`;
    const data = await fetcher<ApiValidatorStatsResponse>(endpoint);

    for (const { averageMev, validatorPubkey } of data.validatorStats) {
      record[validatorPubkey] = averageMev;
    }
  } catch {
    //
  }

  return record;
}

export type GetRawMevArgs = {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
  withBlockInfo?: boolean;
};

export async function getRawMev(params: GetRawMevArgs) {
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

  const endpoint = `${API_URL}/v1/raw_mev?${query.toString()}`;
  const data = await fetcher<ApiRawMevResponse>(endpoint);

  return data.datapoints;
}

export type GetCumulativeMevArgs = {
  proposer: string;
  every: number;
  limit: number;
  probabilityThreshold: number;
};

export async function getCumulativeMev(args: GetCumulativeMevArgs) {
  const query = new URLSearchParams({
    proposer: args.proposer,
    limit: args.limit.toString(),
    every: args.every.toString(),
    probabilityThreshold: args.probabilityThreshold.toString(),
  });

  const endpoint = `${API_URL}/v1/cumulative_mev?${query.toString()}`;
  const data = await fetcher<ApiCumulativeMevResponse>(endpoint);

  return data.datapoints;
}

export function useValidatorsWithStatsQuery(blocks: number) {
  const { data: toHeight } = useLatestHeightQuery();
  const { data: validators } = useValidatorsQuery();

  const queryKey = useMemo(
    () => ["USE_VALIDATOR_STATS", { blocks, toHeight, validators }] as const,
    [blocks, toHeight, validators]
  );

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, args] }) => {
      if (!args.toHeight) return;
      if (!args.validators) return;

      let fromHeight = args.toHeight - args.blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const stats = await getValidatorStats({
        fromHeight,
        toHeight: args.toHeight,
      });

      const validatorWithStats = args.validators
        .map(
          (validator): ValidatorWithStats => ({
            ...validator,
            averageMev: parseFloat(stats[validator.pubkey]) || 0.0,
          })
        )
        .sort((a, b) => b.averageMev - a.averageMev);

      return validatorWithStats;
    },
    enabled: !!toHeight && !!validators,
    keepPreviousData: true,
  });
}

export function useValidatorsQuery() {
  const queryKey = useMemo(() => ["USE_VALIDATORS"] as const, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return getValidators();
    },
    keepPreviousData: true,
  });
}

export type UseRawMevQueryArgs = {
  proposer: string;
  withBlockInfo: boolean;
};

export function useRawMEVQuery(args: UseRawMevQueryArgs) {
  const queryKey = useMemo(() => ["USE_LATEST_HEIGHT", args] as const, [args]);

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, { proposer, withBlockInfo }] }) => {
      return getRawMev({
        proposers: [proposer],
        limit: 1000,
        withBlockInfo: withBlockInfo,
      });
    },
    enabled: Boolean(args.proposer),
  });
}

export function useCumulativeMEVQuery() {
  const queryKey = useMemo(() => ["USE_CUMULATIVE_MEV"] as const, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const endpoint = "/api/main-chart-data";
      const data = await fetcher<MainChartData[]>(endpoint);
      return data;
    },
  });
}

// TODO: remove if unused
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
