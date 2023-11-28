export const fetcher = async <T>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  const data = await response.json();
  return data as T;
};
