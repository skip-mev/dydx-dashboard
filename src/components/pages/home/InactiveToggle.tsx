import { CheckIcon } from "@/components/icons/Check";
import { useHomeStore } from "@/store/home";
import * as Checkbox from "@radix-ui/react-checkbox";

export const InactiveToggle = () => {
  const hideInactive = useHomeStore((state) => state.hideInactive);

  const setHideInactive = (newValue: unknown) => {
    if (typeof newValue === "boolean") {
      useHomeStore.setState({ hideInactive: newValue });
    }
  };

  return (
    <Checkbox.Root
      checked={hideInactive}
      className="flex h-5 w-5 items-center justify-center rounded-sm bg-white/10 hover:bg-white/20"
      id="hideInactive"
      onCheckedChange={setHideInactive}
    >
      <Checkbox.Indicator className="text-yellow-500">
        <CheckIcon className="w-[15px] h-[15px]" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};
