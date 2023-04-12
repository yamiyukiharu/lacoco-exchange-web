import { Token } from "@/types";
import BigNumber from "bignumber.js";

export function convertAmounts(fromToken: Token, toToken: Token, amount: string): string {
  if (amount == "") {
    return "0.0";
  }
  
  return new BigNumber(amount)
    .multipliedBy(fromToken.usdPrice)
    .dividedBy(toToken.usdPrice)
    .decimalPlaces(toToken.decimalPlaces, BigNumber.ROUND_DOWN)
    .toString();
}
