import * as RadixSelect from "@radix-ui/react-select";
import { FC, PropsWithChildren } from "react";

export interface SelectProps extends PropsWithChildren {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  value?: string;
}

export const Select: FC<SelectProps> = ({
  children,
  defaultValue,
  onValueChange,
  onOpenChange,
  value,
}) => {
  return (
    <RadixSelect.Root
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpenChange={onOpenChange}
      value={value}
    >
      {children}
    </RadixSelect.Root>
  );
};

interface SelectTriggerProps {
  className?: string;
}

export const SelectTrigger: FC<SelectTriggerProps> = ({ className }) => {
  return (
    <RadixSelect.Trigger
      className={`text-sm text-light-700 hover:text-white hover:bg-zinc-800 inline-flex gap-1.5 items-center justify-between py-1 pl-3 pr-1 rounded transition-colors focus:outline-none whitespace-nowrap ${className}`}
    >
      <RadixSelect.Value className="truncate"></RadixSelect.Value>
      <RadixSelect.Icon>
        <svg
          className="w-5 h-5 fill-white/60"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.99998 12.2083L6.33331 8.54166H13.6666L9.99998 12.2083Z" />
        </svg>
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
};

export const SelectContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className="bg-dydx-bg text-light/75 text-sm border border-zinc-800 rounded-md shadow-md font-sans max-h-64 overflow-y-auto z-50 mt-1"
        position="popper"
      >
        <RadixSelect.Viewport className="p-2 space-y-2">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
};

export interface SelectItemProps extends PropsWithChildren {
  value: string;
  onMouseOver?: () => void;
}

export const SelectItem: FC<SelectItemProps> = ({
  children,
  value,
  onMouseOver,
}) => {
  return (
    <RadixSelect.Item
      className="px-3 py-2 min-w-[100px] rounded-md hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none"
      value={value}
      onMouseOver={onMouseOver}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
};
