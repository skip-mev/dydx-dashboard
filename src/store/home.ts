import { Validator, ValidatorWithStats } from "@/types/base";
import { ValidatorComparer } from "@/types/utils";
import { useCallback } from "react";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export interface HomeStore {
  searchValue: string;
  blocks: number;
  sortBy: "validator" | "averageMev" | "stake" | (string & {});
  sortDirection: "asc" | "desc" | (string & {});
  selectedMonikers: Record<ValidatorWithStats["moniker"], boolean>;
  highlightedMoniker: ValidatorWithStats["moniker"] | undefined;
  hideInactive: boolean;
}

export const useHomeStore = /* @__PURE__ */ create(
  persist(
    subscribeWithSelector<HomeStore>(() => ({
      searchValue: "",
      blocks: 43200,
      sortBy: "averageMev",
      sortDirection: "desc",
      selectedMonikers: {},
      highlightedMoniker: undefined,
      hideInactive: true,
    })),
    {
      name: "dydx-dashboard",
      version: 1,
      partialize: (state) => ({
        selectedMonikers: state.selectedMonikers,
      }),
    }
  )
);

export function hasSelectedMoniker(value: Pick<ValidatorWithStats, "moniker">) {
  const { selectedMonikers } = useHomeStore.getState();
  return selectedMonikers[value.moniker] ?? false;
}

export function addSelectedMoniker(value: Pick<ValidatorWithStats, "moniker">) {
  useHomeStore.setState((current) => {
    const latest = {
      ...current.selectedMonikers,
      [value.moniker]: true,
    };
    return {
      selectedMonikers: latest,
    };
  });
}

export function removeSelectedMoniker(
  value: Pick<ValidatorWithStats, "moniker">
) {
  useHomeStore.setState((current) => {
    const { [value.moniker]: _, ...latest } = current.selectedMonikers;

    return {
      selectedMonikers: latest,
    };
  });
}

export function toggleSelectedMoniker(
  value: Pick<ValidatorWithStats, "moniker">
) {
  if (hasSelectedMoniker(value)) {
    removeSelectedMoniker(value);
  } else {
    addSelectedMoniker(value);
  }
  setHighlightedMoniker(undefined);
}

export function resetSelectedMoniker(
  value?: Pick<ValidatorWithStats, "moniker">[]
) {
  const latest: HomeStore["selectedMonikers"] = {};
  value?.forEach((v) => {
    latest[v.moniker] = true;
  });
  useHomeStore.setState({
    selectedMonikers: latest,
  });
}

export function setHighlightedMoniker(
  value: Pick<ValidatorWithStats, "moniker"> | undefined
) {
  useHomeStore.setState({
    highlightedMoniker: value?.moniker,
  });
}

export function useHomeStoreValidatorComparer() {
  const sortBy = useHomeStore((state) => state.sortBy);
  const sortDirection = useHomeStore((state) => state.sortDirection);

  return useCallback(
    <T extends Validator | ValidatorWithStats>(a: T, b: T) => {
      if (sortBy === "validator" && sortDirection === "asc") {
        return ValidatorComparer.VALIDATOR_ASC(a, b);
      }

      if (sortBy === "validator" && sortDirection === "desc") {
        return ValidatorComparer.VALIDATOR_DESC(a, b);
      }

      if ("averageMev" in a && "averageMev" in b && sortBy === "averageMev") {
        if (sortDirection === "asc") {
          return ValidatorComparer.AVERAGE_MEV_ASC(a, b);
        } else {
          return ValidatorComparer.AVERAGE_MEV_DESC(a, b);
        }
      }

      if (sortBy === "stake") {
        if (sortDirection === "asc") {
          return ValidatorComparer.STAKE_ASC(a, b);
        } else {
          return ValidatorComparer.STAKE_DESC(a, b);
        }
      }

      return -1;
    },
    [sortBy, sortDirection]
  );
}
