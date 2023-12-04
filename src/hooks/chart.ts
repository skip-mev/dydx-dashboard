import { getMainChartData } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Fetches the cumulative MEV data for all validators.
 */
export function useMainChartData() {
  const queryKey = useMemo(() => ["USE_MAIN_CHART_DATA"] as const, []);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await getMainChartData();
    },
  });
}
