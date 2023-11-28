import { useHomeStore } from "@/store/home";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/Select";

const Timeframe = {
  Today: "43200",
  SevenDays: "302400",
  ThirtyDays: "2116800",
};

const timeframeOptions = [
  { label: "Today", value: Timeframe.Today },
  { label: "7 Days", value: Timeframe.SevenDays },
  { label: "30 Days", value: Timeframe.ThirtyDays },
];

export const TimeframeSelect = () => {
  const blocks = useHomeStore((state) => state.blocks);

  const setBlocks = (value: string) => {
    useHomeStore.setState({ blocks: parseInt(value) });
  };

  return (
    <Select defaultValue={Timeframe.Today} onValueChange={setBlocks}>
      <SelectTrigger />
      <SelectContent>
        {timeframeOptions.map(({ label, value }, i) => (
          <SelectItem key={i} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
