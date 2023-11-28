import CustomTooltip from "@/components/CustomTooltip";
import { useMainChartData, useValidatorsWithStatsQuery } from "@/hooks";
import { toggleSelectedMoniker, useHomeStore } from "@/store/home";
import clsx from "clsx";
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

  if (chartData.length < 1) {
    return (
      <div
        className={clsx(
          "w-full h-[300px] relative",
          "before:content-[''] before:absolute before:inset-0 before:left-9",
          "before:rounded-sm before:bg-white/5 before:animate-pulse"
        )}
      />
    );
  }

  return (
    <ResponsiveContainer className="overflow-hidden" height={300} width="100%">
      <LineChart data={chartData} margin={{ left: 16, right: 32 }}>
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
        {validators?.map((validator) => (
          <MutatedLine
            key={validator.pubkey}
            dot={false}
            dataKey={validator.moniker}
            isAnimationActive={false}
            onClick={() => toggleSelectedMoniker(validator)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

class MutatedLine extends Line {
  unsub?: () => void;

  componentDidMount() {
    this.unsub = useHomeStore.subscribe(
      (state) => [state.highlightedMoniker, state.selectedMonikers] as const,
      ([highlighted, selected]) => {
        if (typeof this.props.dataKey !== "string" || !this.mainCurve) return;

        const isHighlighted = this.props.dataKey === highlighted;
        const isSelected = selected[this.props.dataKey];

        this.mainCurve.style.stroke = isHighlighted
          ? "#34F3FF"
          : isSelected
          ? "#b51717"
          : "#8884d8";
        this.mainCurve.style.opacity =
          isHighlighted || isSelected ? "1" : "0.3";
      },
      {
        fireImmediately: true,
      }
    );
  }

  componentWillUnmount() {
    this.unsub?.();
  }
}
