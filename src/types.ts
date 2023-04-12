export interface Token {
  name: string;
  symbol: string;
  usdPrice: number;
  decimalPlaces: number;
  icon: string;
}

export interface TokenPrices {
  [key: string]: Token;
}
