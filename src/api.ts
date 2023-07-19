import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const API_URL = "http://localhost:8080";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export interface Validator {
  moniker: string;
  pubkey: string;
  stake: string;
}

export interface GetValidatorsResponse {
  validators: Validator[];
}

export async function getValidators() {
  const response = await axios.get(`${API_URL}/v1/validator`);

  const { validators } = response.data as GetValidatorsResponse;

  return validators;
}

export async function getLatestHeight() {
  const response = await axios.get(`${API_URL}/v1/raw_mev`);

  return parseInt(response.data.datapoints[0].block.height);
}

export interface ValidatorStats {
  averageMev: string;
  averageNormalizedMev: number;
  validatorPubkey: string;
}

export async function getValidatorStats(
  pubkey: string,
  fromHeight: number,
  toHeight: number
) {
  const response = await axios.get(
    `${API_URL}/v1/validator_stats?validator_pubkey=${pubkey}&from_height=${fromHeight}&to_height=${toHeight}`
  );

  return response.data.validatorStats as ValidatorStats;
}

// {
// "value": 0.00003667052,
// "normalized": true,
// "block": {
// "proposer": "06FD24996CC2F531FC12A9DA8896252BB344897A",
// "height": "562099",
// "timestamp": "1689029785"
// }
// }

interface Block {
  proposer: string;
  height: string;
  timestamp: string;
}

interface Datapoint {
  value: number;
  normalized: boolean;
  block: Block;
}

export async function getNormalizedMEV(proposer: string) {
  const response = await axios.get(
    `${API_URL}/v1/normalized_mev?proposer=${proposer}`
  );

  return response.data.datapoints as Datapoint[];
}

export async function getRawMEV(proposer: string) {
  const response = await axios.get(
    `${API_URL}/v1/raw_mev?proposer=${proposer}`
  );

  return response.data.datapoints as Datapoint[];
}

export function useValidatorsWithStatsQuery(blocks: number) {
  return useQuery({
    queryKey: ["validators-with-stats", blocks],
    queryFn: async () => {
      const validators = await getValidators();

      const toHeight = await getLatestHeight();

      let fromHeight = toHeight - blocks;
      if (fromHeight < 0) {
        fromHeight = 1;
      }

      const statPromises = validators.map((validator) =>
        getValidatorStats(validator.pubkey, fromHeight, toHeight)
      );

      const stats = await Promise.all(statPromises);

      return validators.map((validator, index) => ({
        ...validator,
        averageMev: stats[index].averageMev,
        averageNormalizedMev: stats[index].averageNormalizedMev,
      }));
    },
    keepPreviousData: true,
  });
}

export function useValidatorsQuery() {
  return useQuery({
    queryKey: ["validators"],
    queryFn: async () => {
      return getValidators();
    },
    keepPreviousData: true,
  });
}

export function useNormalizedMEVQuery(proposer: string) {
  return useQuery({
    queryKey: ["normalized-mev", proposer],
    queryFn: async () => {
      return getNormalizedMEV(proposer);
    },
    enabled: proposer !== "",
  });
}

export function useRawMEVQuery(proposer: string) {
  return useQuery({
    queryKey: ["raw-mev", proposer],
    queryFn: async () => {
      return getRawMEV(proposer);
    },
    enabled: proposer !== "",
  });
}
