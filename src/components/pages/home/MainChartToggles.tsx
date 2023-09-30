import { useValidatorsWithStatsQuery } from "@/hooks";
import {
  resetSelectedMoniker,
  setHighlightedMoniker,
  toggleSelectedMoniker,
  useHomeStore,
} from "@/store/home";
import { ValidatorComparer } from "@/types/utils";
import { ComponentProps, useEffect } from "react";

export const MainChartToggles = (props: ComponentProps<"div">) => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);
  const selected = useHomeStore((state) => state.selectedMonikers);

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
    if (validators?.[0] && Object.keys(selected).length < 1) {
      resetSelectedMoniker([validators[0]]);
    }
  }, [selected, validators]);

  return (
    <div {...props}>
      {validators?.map((validator) => (
        <button
          className={`${
            selected[validator.moniker]
              ? "bg-[#b51717]"
              : "bg-white/5 hover:bg-[#b51717]"
          } text-xs py-1 px-2 rounded-md transition-colors`}
          key={validator.pubkey}
          onMouseOver={() => setHighlightedMoniker(validator)}
          onClick={() => toggleSelectedMoniker(validator)}
        >
          {validator.moniker}
        </button>
      ))}
    </div>
  );
};
