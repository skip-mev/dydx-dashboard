import { ComponentProps } from "react";

export const ArrowLeftIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.875 7.5H3.125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M7.5 11.875L3.125 7.5L7.5 3.125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
