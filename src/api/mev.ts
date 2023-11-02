import { API_URL } from "@/constants";
import { fetcher } from "@/lib/fetcher";
import { ApiCumulativeMevResponse, ApiRawMevResponse } from "@/types/api";
import { CumulativeDatapoint, Datapoint } from "@/types/base";

export type GetCumulativeMevArgs = {
  proposer: string;
  every: number;
  limit: number;
  probabilityThreshold: number;
};

/**
 * Query cumulative MEV data from `${API_URL}/v1/cumulative_mev`.
 */
export async function getCumulativeMev(
  args: GetCumulativeMevArgs
): Promise<CumulativeDatapoint[]> {
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

export type GetRawMevArgs = {
  proposers: string[];
  from?: number;
  to?: number;
  limit?: number;
  withBlockInfo?: boolean;
};

/**
 * Query raw MEV data from `${API_URL}/v1/raw_mev`.
 */
export async function getRawMev(params: GetRawMevArgs): Promise<Datapoint[]> {
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
