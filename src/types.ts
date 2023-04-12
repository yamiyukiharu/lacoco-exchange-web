export interface TokenInfo {
  [key: string]: {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
  };
}

export interface TokenPrices {
  [key: string]: number;
}
