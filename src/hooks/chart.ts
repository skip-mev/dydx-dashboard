import { fetcher } from "@/lib/fetcher";
import { MainChartData } from "@/types/base";
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
      const endpoint = "/api/main-chart-data";
      const data = await fetcher<MainChartData>(endpoint);
      return data;
    },
  });
}
