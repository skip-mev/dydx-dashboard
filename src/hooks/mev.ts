import { getRawMev } from "@/api";
import { Datapoint } from "@/types/base";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type UseRawMevQueryArgs<T = Datapoint[]> = {
  proposer?: string;
  withBlockInfo: boolean;
  select?: (arr?: Datapoint[]) => T;
};

/**
 * Query raw MEV data for a single proposer from `${API_URL}/v1/raw_mev`.
 * (note: default limit is set to `1000`)
 *
 * @see {@link getRawMev}
 */
export function useRawMEVQuery<T = Datapoint[]>(args: UseRawMevQueryArgs<T>) {
  const { proposer, withBlockInfo, select = (t) => t as T } = args;

  const queryKey = useMemo(() => {
    const args = { proposer, withBlockInfo, select };
    return ["USE_RAW_MEV", args] as const;
  }, [proposer, withBlockInfo, select]);

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, { proposer, withBlockInfo }] }) => {
      if (!proposer) return;
      return getRawMev({
        proposers: [proposer],
        limit: 5000,
        withBlockInfo: withBlockInfo,
      });
    },
    enabled: Boolean(args.proposer),
    select,
  });
}
