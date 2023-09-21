// next js api route
import { cumulativeDatapoints, getRawMEV, getValidators } from "@/api";
import { PageConfig } from "next";
import { NextRequest } from "next/server";

export const config: PageConfig = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const validators = await getValidators();

  const promises = validators.map((validator) =>
    getRawMEV({
      proposers: [validator.pubkey],
      limit: 1000,
    })
  );

  const allData = await Promise.all(promises);

  const cumulativeMEV = validators.map((validator, index) => {
    return {
      validator: validator.moniker,
      cumulativeMEV: cumulativeDatapoints([...allData[index]].reverse(), 0.67),
    };
  });

  return new Response(JSON.stringify(cumulativeMEV), {
    headers: {
      "content-type": "application/json",
      "cache-control": "max-age=1, s-maxage=1, stale-while-revalidate=59",
    },
  });
}
