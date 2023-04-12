import { Token } from "@/types";
import BigNumber from "bignumber.js";

export function convertAmounts(fromToken: Token, toToken: Token, amount: string): string {
  if (amount == "") {
    return "";
  }
  return new BigNumber(amount)
    .multipliedBy(fromToken.usdPrice)
    .dividedBy(toToken.usdPrice)
    .decimalPlaces(toToken.decimals, BigNumber.ROUND_DOWN)
    .toString();
}
