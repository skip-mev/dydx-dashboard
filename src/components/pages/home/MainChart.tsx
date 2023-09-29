import CustomTooltip from "@/components/CustomTooltip";
import { useMainChartData, useValidatorsWithStatsQuery } from "@/hooks";
import {
  addSelectedValidator,
  removeSelectedValidator,
  useHomeStore,
} from "@/store/home";
import { useMemo } from "react";
import {
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export const MainChart = () => {
  const blocks = useHomeStore((state) => state.blocks);
  const hideInactive = useHomeStore((state) => state.hideInactive);
  const highlighted = useHomeStore((state) => state.highlightedValidator);
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

  const { data: mainChartData } = useMainChartData();

  const chartData = useMemo(() => {
    return mainChartData?.points ?? [];
  }, [mainChartData?.points]);

  return (
    <ResponsiveContainer width="100%" height={300} className="overflow-hidden">
      <LineChart
        data={chartData}
        margin={{
          // bottom: 5,
          left: 16,
          right: 32,
          // top: 5,
        }}
      >
        <XAxis
          dataKey="key"
          axisLine={false}
          tickLine={false}
          style={{
            fill: "#fff",
            fontFamily: "monospace",
            fontSize: 13,
            opacity: 0.8,
          }}
          minTickGap={50}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          padding={{ top: 20, bottom: 20 }}
          style={{
            fill: "#fff",
            fontFamily: "monospace",
            fontSize: 13,
            opacity: 0.8,
          }}
        />
        <ChartTooltip content={CustomTooltip} />
        {validators &&
          validators.map((validator) => {
            return (
              <Line
                key={validator.pubkey}
                dot={false}
                dataKey={validator.moniker}
                stroke={
                  selected.includes(validator)
                    ? "#b51717"
                    : validator.moniker === highlighted?.moniker
                    ? "#34F3FF"
                    : "#8884d8"
                }
                isAnimationActive={false}
                opacity={
                  selected.includes(validator) ||
                  validator.moniker === highlighted?.moniker
                    ? 1
                    : 0.3
                }
                onClick={() => {
                  if (selected.includes(validator)) {
                    removeSelectedValidator(validator);
                  } else {
                    addSelectedValidator(validator);
                  }
                }}
              ></Line>
            );
          })}
      </LineChart>
    </ResponsiveContainer>
  );
};
