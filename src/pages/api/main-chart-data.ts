// next js api route
import { cumulativeDatapoints, getRawMEV, getValidators } from "@/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      cumulativeMEV: cumulativeDatapoints([...allData[index]].reverse()),
    };
  });

  res.status(200).json(cumulativeMEV);
}
