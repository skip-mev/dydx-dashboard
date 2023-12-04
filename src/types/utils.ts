import slugify from "@sindresorhus/slugify";
import { formatUnits } from "ethers";
import { Validator, ValidatorWithStats } from "./base";

export const ValidatorComparer = {
  VALIDATOR_ASC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    const left = "slug" in a ? a.slug : slugify(a.moniker);
    const right = "slug" in b ? b.slug : slugify(b.moniker);
    return left.localeCompare(right);
  },
  VALIDATOR_DESC: <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
    const left = "slug" in a ? a.slug : slugify(a.moniker);
    const right = "slug" in b ? b.slug : slugify(b.moniker);
    return right.localeCompare(left);
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
