import { TokenInfo } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTokenInfo = () => {
  const { data, isLoading, isError } = useQuery<TokenInfo>(
    ["tokenInfo"],
    async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "tokens");
      return await res.json();
    },
    { staleTime: Infinity, cacheTime: Infinity }
  );

  return {
    tokenInfo: data,
    isLoading,
    isError,
  };
};
