import { TokenInfoDto } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTokenInfo = () => {
  const { data, isLoading, isError } = useQuery<TokenInfoDto>(
    ["tokenInfo"],
    async () => {
      const res = await fetch("http://localhost:3000/api/tokens");
      return res.json();
    },
    { staleTime: Infinity, cacheTime: Infinity }
  );

  return {
    tokenInfo: data,
    isLoading,
    isError,
  };
};
