import * as constants from "@/constants";
import { MainChartData } from "@/types/base";

import { getCumulativeMev } from "./mev";
import { getValidators } from "./validator";

/**
 * Fetches the cumulative MEV data for all validators.
 */
export async function getMainChartData(): Promise<MainChartData[]> {
  const validators = await getValidators();

  const allData = await Promise.all(
    validators.map((validator) => {
      return getCumulativeMev({
        proposer: validator.pubkey,
        limit: constants.MAIN_CHART_DATAPOINT_LIMIT,
        every: constants.MAIN_CHART_DATAPOINT_EVERY,
        probabilityThreshold: constants.PROBABILITY_THRESHOLD,
      });
    })
  );

  const data = validators.map(
    (validator, index): MainChartData => ({
      validator: validator.moniker,
      cumulativeMev: allData[index].map(({ value }, index) => ({
        key: index * constants.MAIN_CHART_DATAPOINT_EVERY,
        value,
      })),
    })
  );

  return data;
}
