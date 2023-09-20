import { FC } from "react";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (!(active && Array.isArray(payload))) return;
  return (
    <div className="bg-[#151617] p-4 font-mono text-xs border border-zinc-800 rounded-md shadow-md">
      {payload
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 10)
        .map((item: any, index: number) => {
          return (
            <div
              className={`flex items-center gap-4 ${
                item.stroke === "#b51717" ? "text-[#b51717]" : null
              }`}
              key={index}
            >
              <p className="flex-1 max-w-[100px] truncate">{item.dataKey}: </p>
              <p>
                {new Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                }).format(item.value as number)}{" "}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default CustomTooltip;
