import { useIsFetching } from "@tanstack/react-query";

export const ValidatorLoadingIndicator = () => {
  const isValidatorsLoading = useIsFetching({
    queryKey: ["USE_VALIDATORS_WITH_STATS"],
  });

  if (!isValidatorsLoading) return null;

  return (
    <div className="w-full h-1 bg-indigo-500 fixed top-0 left-0 right-0 overflow-hidden z-50">
      <div className="bg-indigo-600 w-full h-full animate-fade-right animate-infinite" />
    </div>
  );
};
