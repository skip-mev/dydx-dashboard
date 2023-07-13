import { ElementType, FC, JSXElementConstructor } from "react";

export interface InputProps {
  leadingIcon?: ElementType | JSXElementConstructor<any>;
  placeholder?: string;
}

export const Input: FC<InputProps> = ({ leadingIcon, placeholder }) => {
  const LeadingIcon = leadingIcon;
  return (
    <div className="block w-full relative">
      {LeadingIcon && (
        <div className="absolute inset-y-0 px-3 flex items-center justify-center text-light-40">
          <LeadingIcon />
        </div>
      )}
      <input
        className={`w-full text-sm bg-transparent border border-light/25 focus:outline-none focus:border-light/50 rounded-md p-2 ${
          LeadingIcon ? "pl-[44px]" : null
        } placeholder:text-light/50`}
        placeholder={placeholder}
      />
    </div>
  );
};
