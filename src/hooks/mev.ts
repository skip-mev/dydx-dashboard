import { getRawMev } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
