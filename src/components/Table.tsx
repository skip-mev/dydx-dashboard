import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";

export const Table = ({ className, ...props }: ComponentProps<"table">) => {
  return (
    <table
      {...props}
      className={clsx("border-separate border-spacing-0 font-mono", className)}
    />
  );
};

export interface TableHeaderProps extends ComponentProps<"tr"> {
  _thead?: ComponentProps<"thead">;
}

export const TableHeader = forwardRef<HTMLTableRowElement, TableHeaderProps>(
  function TableHeader({ _thead, ...props }, ref) {
    return (
      <thead {..._thead}>
        <tr {...props} className={`bg-zinc-800 ${props.className}`} ref={ref} />
      </thead>
    );
  }
);

export const TableBody = (props: ComponentProps<"tbody">) => {
  return <tbody {...props} />;
};

export const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  return (
    <th
      className={clsx(
        "text-sm text-white/70 font-normal",
        "px-4 py-2 md:px-6 md:py-4",
        className
      )}
      {...props}
    />
  );
};

export const TableRow = ({ className, ...props }: ComponentProps<"tr">) => {
  return <tr className={`hover:bg-zinc-700 ${className}`} {...props} />;
};

export const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  return (
    <td
      className={clsx(
        "text-sm text-white whitespace-nowrap",
        "px-4 py-2 md:px-6 md:py-4",
        className
      )}
      {...props}
    />
  );
};
