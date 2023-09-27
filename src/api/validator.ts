import { API_URL } from "@/constants";
import { fetcher } from "@/lib/fetcher";
import { ApiValidatorResponse, ApiValidatorStatsResponse } from "@/types/api";
import { Validator } from "@/types/base";

/**
 * Fetches the validators from `${API_URL}/v1/validator`.
 */
export async function getValidators(): Promise<Validator[]> {
  const endpoint = `${API_URL}/v1/validator`;
  const { validators } = await fetcher<ApiValidatorResponse>(endpoint);

  return validators;
}

export type GetValidatorStatsArgs = {
  fromHeight: number;
  toHeight: number;
};

/**
 * Fetches the validator stats from `${API_URL}/v1/validator_stats`.
 */
export async function getValidatorStats(
  args: GetValidatorStatsArgs
): Promise<Record<string, string>> {
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
