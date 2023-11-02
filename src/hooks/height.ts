import { getLatestHeight } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Fetches the latest block height from `${API_URL}/v1/block_range`.
 *
 * @see {@link getLatestHeight}
 */
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
