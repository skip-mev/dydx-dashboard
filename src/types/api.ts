import {
  CumulativeDatapoint,
  Datapoint,
  Validator,
  ValidatorStats,
} from "./base";

export type ApiBlockRangeResponse = {
  firstHeight: string;
  lastHeight: string;
};

export type ApiCumulativeMevResponse = {
  datapoints: CumulativeDatapoint[];
};

export type ApiRawMevResponse = {
  datapoints: Datapoint[];
};

export type ApiValidatorResponse = {
  validators: Validator[];
};

export type ApiValidatorStatsResponse = {
  validatorStats: ValidatorStats[];
};
