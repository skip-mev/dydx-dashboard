export type CumulativeDatapoint = {
  height: string;
  value: number;
};

export type Datapoint = {
  height: string;
  probability: number;
  proposer: string;
  value: number;
};

export type MainChartData = {
  validator: string;
  cumulativeMev: { key: number; value: number }[];
}[];

export type Validator = {
  moniker: string;
  pubkey: string;
  stake: string;
};

export type ValidatorWithStats = Validator & {
  averageMev: number;
};

export type ValidatorStats = {
  averageMev: string;
  validatorPubkey: string;
};
