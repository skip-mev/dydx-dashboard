import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/Select";
import { HomeStore, useHomeStore } from "@/store/home";

const options: { value: HomeStore["sortBy"]; label: string }[] = [
  { value: "validator", label: "Validator" },
  { value: "averageMev", label: "Avg. Discrepancy" },
  { value: "stake", label: "Stake Weight" },
];

export const SortBySelect = () => {
  const sortBy = useHomeStore((state) => state.sortBy);

  const handleChange = (value: string) => {
    useHomeStore.setState({ sortBy: value });
  };

  return (
    <Select value={sortBy} onValueChange={handleChange}>
      <SelectTrigger />
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
