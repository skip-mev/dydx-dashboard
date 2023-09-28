import { ValidatorWithStats } from "@/types/base";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface HomeStore {
  searchValue: string;
  blocks: number;
  sortBy: "validator" | "averageMev" | "stake" | (string & {});
  sortDirection: "asc" | "desc" | (string & {});
  /** @deprecated */
  selectedValidators: ValidatorWithStats[];
  selectedValidatorsSet: Set<ValidatorWithStats["moniker"]>;
  highlightedValidator: ValidatorWithStats | undefined;
  hideInactive: boolean;
}

export const useHomeStore = /* @__PURE__ */ create(
  subscribeWithSelector<HomeStore>(() => ({
    searchValue: "",
    blocks: 43200,
    sortBy: "stake",
    sortDirection: "desc",
    selectedValidators: [],
    selectedValidatorsSet: new Set(),
    highlightedValidator: undefined,
    hideInactive: true,
  }))
);

export function addSelectedValidator(value: ValidatorWithStats) {
  useHomeStore.setState((current) => {
    const moniker = value.moniker;
    const latest = new Set(current.selectedValidatorsSet);
    latest.add(moniker);
    return {
      selectedValidators: current.selectedValidators.concat(value),
      selectedValidatorsSet: latest,
    };
  });
}

export function removeSelectedValidator(value: ValidatorWithStats) {
  useHomeStore.setState((current) => {
    const moniker = value.moniker;
    const latest = new Set(current.selectedValidatorsSet);
    latest.delete(moniker);
    return {
      selectedValidators: current.selectedValidators.filter(
        (v) => v.moniker !== moniker
      ),
      selectedValidatorsSet: latest,
    };
  });
}

export function resetSelectedValidators(value?: ValidatorWithStats[]) {
  useHomeStore.setState({
    selectedValidators: value ?? [],
    selectedValidatorsSet: new Set(value?.map((v) => v.moniker) ?? []),
  });
}
