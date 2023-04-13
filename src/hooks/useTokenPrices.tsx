import { TokenPrices } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTokenInfo } from "./useTokenInfo";

const useTokenPrices = () => {
  const { tokenInfo } = useTokenInfo();

  const { data, isLoading, isError } = useQuery<TokenPrices>({
    queryKey: ["tokenPrices"],
    queryFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "tokens/prices");
      return (await res.json()) as TokenPrices;

      // return Object.values(tokens);
    },
    refetchInterval: 10000,
  });

  return {
    tokenPrices: data,
    isLoading,
    isError,
  };
};

export default useTokenPrices;
