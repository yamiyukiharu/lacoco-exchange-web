import BigNumber from "bignumber.js";

export function convertAmounts(amount: string, fromPrice: number, toPrice: number, decimals: number): string {
  if (amount == "") {
    return "";
  }
  return new BigNumber(amount)
    .multipliedBy(fromPrice)
    .dividedBy(toPrice)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .toString();
}
