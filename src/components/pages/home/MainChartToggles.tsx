import { useValidatorsWithStatsQuery } from "@/hooks";
import {
  resetSelectedMoniker,
  setHighlightedMoniker,
  toggleSelectedMoniker,
  useHomeStore,
} from "@/store/home";
import { Validator } from "@/types/base";
import { ValidatorComparer } from "@/types/utils";
import clsx from "clsx";
import { memo, useEffect } from "react";

export const MainChartToggles = () => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);

  const { data: validators = [] } = useValidatorsWithStatsQuery({
    blocks,
    select: (arr = []) => {
      if (hideInactive) {
        arr = arr.filter((validator) => validator.stake !== "0");
      }
      return arr.sort(ValidatorComparer.AVERAGE_MEV_DESC);
    },
  });

  useEffect(() => {
    const unsub = useHomeStore.subscribe(
      (state) => state.selectedMonikers,
      (selected) => {
        if (validators?.[0] && Object.keys(selected).length === 0) {
          resetSelectedMoniker([validators[0]]);
        }
      },
      {
        fireImmediately: true,
      }
    );
    return unsub;
  }, [validators]);

  return (
    <div className="flex justify-center gap-2 flex-wrap pt-8 h-full max-h-32 md:max-h-full overflow-hidden">
      {validators?.map((validator) => (
        <ToggleMoniker key={validator.pubkey} moniker={validator.moniker} />
      ))}
    </div>
  );
};

const ToggleMoniker = memo(
  function ToggleMoniker({ moniker }: Pick<Validator, "moniker">) {
    const highlighted = useHomeStore((state) => state.highlightedMoniker);
    const selected = useHomeStore((state) => state.selectedMonikers);
    return (
      <button
        className={clsx(
          "text-xs py-1 px-2 rounded-md",
          "bg-white/5 hover:bg-red-700 transition-colors duration-100",
          "data-[highlighted=true]:bg-cyan-600 data-[highlighted=true]:hover:bg-cyan-600",
          "data-[selected=true]:bg-red-700"
        )}
        onClick={() => toggleSelectedMoniker({ moniker })}
        onMouseEnter={() => setHighlightedMoniker({ moniker })}
        onMouseLeave={() => setHighlightedMoniker(undefined)}
        data-highlighted={highlighted === moniker}
        data-selected={selected[moniker]}
      >
        {moniker}
      </button>
    );
  }
  //
);
