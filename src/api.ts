import { Datapoint } from "@/types/base";

export * from "./api/chart";
export * from "./api/height";
export * from "./api/mev";
export * from "./api/validator";

// TODO: remove if unused
export function cumulativeDatapoints(
  datapoints: Datapoint[],
  probabilityThreshold: number
) {
  const reversedValues = Array.from(datapoints).reverse();

  return reversedValues.map((_, index) => {
    return {
      key: reversedValues.length - index,
      value: reversedValues.slice(0, index + 1).reduce((acc, value) => {
        let discrepancy = value.value;
        if (value.probability > probabilityThreshold) {
          return acc + discrepancy;
        } else {
          return acc;
        }
      }, 0),
    };
  });
}
