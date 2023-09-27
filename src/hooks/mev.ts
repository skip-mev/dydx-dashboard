import { getRawMev } from "@/api";
import { fetcher } from "@/lib/fetcher";
import { MainChartData } from "@/types/base";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Fetches the cumulative MEV data for all validators.
 */
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

export type UseRawMevQueryArgs = {
  proposer: string;
  withBlockInfo: boolean;
};

/**
 * Query raw MEV data for a single proposer from `${API_URL}/v1/raw_mev`.
 * (note: default limit is set to `1000`)
 *
 * @see {@link getRawMev}
 */
export function useRawMEVQuery(args: UseRawMevQueryArgs) {
  const queryKey = useMemo(() => ["USE_RAW_MEV", args] as const, [args]);

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
