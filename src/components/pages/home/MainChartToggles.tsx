import { useValidatorsWithStatsQuery } from "@/hooks";
import {
  addSelectedValidator,
  removeSelectedValidator,
  resetSelectedValidators,
  useHomeStore,
} from "@/store/home";
import { ComponentProps, useEffect } from "react";

export const MainChartToggles = (props: ComponentProps<"div">) => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);
  const selected = useHomeStore((state) => state.selectedValidators);

  const { data: validators = [] } = useValidatorsWithStatsQuery({
    blocks,
    select: (arr = []) => {
      if (hideInactive) {
        arr = arr.filter((validator) => validator.stake !== "0");
      }
      return arr;
    },
  });

  useEffect(() => {
    if (validators?.[0] && selected.length === 0) {
      resetSelectedValidators([validators[0]]);
    }
  }, [selected, validators]);

  return (
    <div {...props}>
      {validators?.map((validator) => (
        <button
          className={`${
            selected.includes(validator)
              ? "bg-[#b51717]"
              : "bg-white/5 hover:bg-[#b51717]"
          } text-xs py-1 px-2 rounded-md transition-colors`}
          key={validator.pubkey}
          onMouseOver={() =>
            useHomeStore.setState({
              highlightedValidator: validator,
            })
          }
          onClick={() => {
            if (selected.includes(validator)) {
              removeSelectedValidator(validator);
            } else {
              addSelectedValidator(validator);
            }
          }}
        >
          {validator.moniker}
        </button>
      ))}
    </div>
  );
};
