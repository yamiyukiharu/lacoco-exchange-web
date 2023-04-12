export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
};

export interface TokenInfoDto {
  [key: string]:TokenInfo
}

export interface TokenPricesDto {
  [key: string]: number;
}

export interface Token extends TokenInfo {
  usdPrice: number;
}