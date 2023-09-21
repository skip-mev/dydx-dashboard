// next js api route
import { cumulativeDatapoints, getCumulativeMEV, getValidators } from "@/api";
import { PageConfig } from "next";
import { NextRequest } from "next/server";
import { MAIN_CHART_DATAPOINT_EVERY, MAIN_CHART_DATAPOINT_LIMIT, PROBABILITY_THRESHOLD } from "@/constants";

export const config: PageConfig = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const validators = await getValidators();

  const promises = validators.map((validator) =>
    getCumulativeMEV({
      proposer: validator.pubkey,
      limit: MAIN_CHART_DATAPOINT_LIMIT,
      every: MAIN_CHART_DATAPOINT_EVERY,
      probabilityThreshold: PROBABILITY_THRESHOLD,
    })
  );

  const allData = await Promise.all(promises);
  console.log(allData)
  const cumulativeMEV = validators.map((validator, index) => {
    return {
      validator: validator.moniker,
      cumulativeMEV: allData[index].map((value, index) => { return {key: index * MAIN_CHART_DATAPOINT_EVERY, value: value.value}}),
    };
  });

  return new Response(JSON.stringify(cumulativeMEV), {
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=1, s-maxage=1, stale-while-revalidate=59",
    },
  });
}
