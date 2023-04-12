import { Token, TokenPrices } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useTokenPrices = () => {
  const { data, isLoading, isError } = useQuery<Token[]>(
    ["tokenPrices"],
    async () => {
      // const res = await fetch(
      //   'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd'
      // );
      // return res.json();
      const tokens = {
        USDT: {
          name: "Tether",
          symbol: "USDT",
          usdPrice: 1.0,
          decimalPlaces: 2,
          icon: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        },
        BTC: {
          name: "Bitcoin",
          symbol: "BTC",
          usdPrice: 33000.45,
          decimalPlaces: 6,
          icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
        },
        ETH: {
          name: "Ethereum",
          symbol: "ETH",
          usdPrice: 2100.67,
          decimalPlaces: 6,
          icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        },
      };
      console.log("hello");
      // returns an array of tokens
      return Object.values(tokens);
    },
    {
      refetchInterval: 30000,
    }
  );

  return {
    prices: data,
    isLoading,
    isError,
  };
};

export default useTokenPrices;
