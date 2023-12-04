import { usdIntl } from "@/lib/intl";
import { hasSelectedMoniker } from "@/store/home";
import { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!(active && payload)) return;
  return (
    <div className="bg-dydx-bg p-4 font-mono text-xs border border-zinc-800 rounded-md shadow-md">
      {payload
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
        .slice(0, 10)
        .map((item, index) => (
          <div
            className="flex items-center gap-4 data-[selected=true]:text-red-500"
            key={index}
            data-selected={
              typeof item.dataKey === "string" &&
              hasSelectedMoniker({ moniker: item.dataKey })
            }
          >
            <p className="flex-2 max-w-[100px] truncate">{item.dataKey}: </p>
            <div className="flex-1" />
            <p>{usdIntl.format(item.value ?? 0)} </p>
          </div>
        ))}
    </div>
  );
};

export default CustomTooltip;
