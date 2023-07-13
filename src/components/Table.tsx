import { FC, PropsWithChildren } from "react";

export const Table: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full whitespace-nowrap font-mono">{children}</table>
    </div>
  );
};

export const TableHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="text-left bg-white/5">
      <tr>{children}</tr>
    </thead>
  );
};

export const TableBody: FC<PropsWithChildren> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

interface TableHeadProps extends PropsWithChildren {
  align?: "left" | "center" | "right";
}

export const TableHead: FC<TableHeadProps> = ({ align = "left", children }) => {
  return (
    <th
      className={`text-sm text-${align} text-white/70 font-normal px-3 first:pl-12 last:pr-12 py-5`}
    >
      {children}
    </th>
  );
};

interface TableRowProps extends PropsWithChildren {
  className?: string;
}

export const TableRow: FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr className={`transition-colors hover:bg-[#262829] ${className}`}>
      {children}
    </tr>
  );
};

interface TableCellProps extends PropsWithChildren {
  align?: "left" | "center" | "right";
  className?: string;
}

export const TableCell: FC<TableCellProps> = ({
  align,
  children,
  className,
}) => {
  return (
    <td
      className={`text-sm text-${align} text-white whitespace-nowrap p-3 first:pl-12 last:pr-12 ${className}`}
    >
      {children}
    </td>
  );
};
