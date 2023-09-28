import { Input } from "@/components/Input";
import { SearchIcon } from "@/components/icons/Search";
import { useHomeStore } from "@/store/home";

export const SearchInput = () => {
  const searchValue = useHomeStore((state) => state.searchValue);
  return (
    <Input
      leadingIcon={() => <SearchIcon className="w-5 h-5" />}
      placeholder="Filter validators"
      value={searchValue}
      onChange={(newValue) => useHomeStore.setState({ searchValue: newValue })}
    />
  );
};
