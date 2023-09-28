import * as constants from "@/constants";
import { MainChartData } from "@/types/base";

import { formatUnits } from "ethers";
import { getCumulativeMev } from "./mev";
import { getValidators } from "./validator";

/**
 * Fetches the cumulative MEV data for all validators.
 */
export async function getMainChartData(): Promise<MainChartData> {
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
    (validator, index): MainChartData["data"][number] => ({
      validator: validator.moniker,
      cumulativeMev: allData[index].map(({ value }, index) => ({
        key: index * constants.MAIN_CHART_DATAPOINT_EVERY,
        value,
      })),
    })
  );

  const points: Record<string, number>[] = [];

  const validatorData: Record<string, number[]> = {};
  for (const { validator, cumulativeMev } of data) {
    validatorData[validator] = cumulativeMev.map((v) =>
      parseFloat(formatUnits(v.value.toFixed(0), 6))
    );
  }

  for (
    let i = 0;
    i <
    constants.MAIN_CHART_DATAPOINT_LIMIT / constants.MAIN_CHART_DATAPOINT_EVERY;
    i++
  ) {
    const point: Record<string, number> = {
      key: (i + 1) * constants.MAIN_CHART_DATAPOINT_EVERY,
    };

    for (const { validator } of data) {
      if (i in validatorData[validator]) {
        point[validator] = validatorData[validator][i];
      }
    }

    points.push(point);
  }

  return { data, points };
}
