import { API_URL } from "@/constants";
import { fetcher } from "@/lib/fetcher";
import { ApiBlockRangeResponse } from "@/types/api";

/**
 * Fetches the latest block height from `${API_URL}/v1/block_range`.
 */
export async function getLatestHeight(): Promise<number> {
  const endpoint = `${API_URL}/v1/block_range`;
  const data = await fetcher<ApiBlockRangeResponse>(endpoint);

  return parseInt(data.lastHeight);
}
