import { SortIcon } from "@/components/icons/Sort";
import { useHomeStore } from "@/store/home";

export const SortOrderButton = () => {
  const sortDirection = useHomeStore((state) => state.sortDirection);

  const handleChange = () => {
    useHomeStore.setState({
      sortDirection: sortDirection === "asc" ? "desc" : "asc",
    });
  };

  return (
    <button
      className="text-white/70 hover:text-white transition-colors"
      onClick={handleChange}
    >
      <SortIcon className="w-4 h-4" direction={sortDirection} />
    </button>
  );
};
