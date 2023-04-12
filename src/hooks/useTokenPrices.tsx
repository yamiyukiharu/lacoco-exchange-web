import { Token, TokenPricesDto } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTokenInfo } from "./useTokenInfo";

const useTokenPrices = () => {
  const { tokenInfo } = useTokenInfo();

  const { data, isLoading, isError } = useQuery<Token[]>({
    queryKey: ["tokenPrices"],
    queryFn: async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "tokens/prices");
      const prices = (await res.json()) as TokenPricesDto;

      return Object.keys(tokenInfo!).map((key) => {
        const usdPrice = prices[key];

        return {
          ...tokenInfo![key],
          usdPrice,
        };
      });

      // return Object.values(tokens);
    },
    enabled: !!tokenInfo,
    refetchInterval: 10000,
  });

  return {
    prices: data,
    isLoading,
    isError,
  };
};

export default useTokenPrices;
