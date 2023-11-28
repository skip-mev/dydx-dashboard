import { formatUnits } from "ethers";
import { Validator, ValidatorWithStats } from "./base";

export const ValidatorComparer = {
  VALIDATOR_ASC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    return a.moniker.localeCompare(b.moniker);
  },
  VALIDATOR_DESC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    return b.moniker.localeCompare(a.moniker);
  },
  AVERAGE_MEV_ASC: <T extends ValidatorWithStats>(a: T, b: T) => {
    const aMev = parseFloat(formatUnits(a.averageMev, 6));
    const bMev = parseFloat(formatUnits(b.averageMev, 6));
    return aMev - bMev;
  },
  AVERAGE_MEV_DESC: <T extends ValidatorWithStats>(a: T, b: T) => {
    const aMev = parseFloat(formatUnits(a.averageMev, 6));
    const bMev = parseFloat(formatUnits(b.averageMev, 6));
    return bMev - aMev;
  },
  STAKE_ASC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    const aStake = parseFloat(formatUnits(a.stake, 6));
    const bStake = parseFloat(formatUnits(b.stake, 6));
    return aStake - bStake;
  },
  STAKE_DESC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    const aStake = parseFloat(formatUnits(a.stake, 6));
    const bStake = parseFloat(formatUnits(b.stake, 6));
    return bStake - aStake;
  },
};
