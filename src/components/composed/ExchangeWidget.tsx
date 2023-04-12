import React, { useState } from "react";
import BigNumber from "bignumber.js";
import SwapButton from "@components/SwapButton";
import ExchangeInputs from "@components/composed/ExchangeInputs";
import { convertAmounts } from "@/utils/convertAmounts";
import { Token } from "@/types";

interface Props {
  tokens: Token[];
}

function ExchangeWidget({ tokens }: Props) {
  const [fromTokenList, setFromTokenList] = useState(tokens.filter((token) => token.symbol !== tokens[1].symbol));
  const [toTokenList, setToTokenList] = useState(tokens.filter((token) => token.symbol !== tokens[0].symbol));

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleFromTokenChange = (token: Token) => {
    // account for change in decimal places of different tokens
    const newFromAmount = new BigNumber(fromAmount).decimalPlaces(token.decimalPlaces, BigNumber.ROUND_DOWN).toString();

    const res = convertAmounts(token, toToken, newFromAmount);
    setFromAmount(newFromAmount);
    setToAmount(res);
    setFromToken(token);
    setToTokenList(tokens.filter((t) => t.symbol !== token.symbol));
  };

  const handleToTokenChange = (token: Token) => {
    // We prioritise fromAmount, so update toAmount when toToken changes
    const res = convertAmounts(fromToken, token, fromAmount);
    setToAmount(res);
    setToToken(token);
    setFromTokenList(tokens.filter((t) => t.symbol !== token.symbol));
  };

  const handleTokenSwap = () => {
    // keep fromAmount constant and update only toAmount
    setToAmount(convertAmounts(toToken, fromToken, fromAmount));
    setFromTokenList(tokens.filter((t) => t.symbol !== fromToken.symbol));
    setToTokenList(tokens.filter((t) => t.symbol !== toToken.symbol));
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const isValidAmount = (token: Token, amount: string) => {
    const floatOnly = new RegExp(`^(?:\\d+|\\d*\\.\\d{0,${token.decimalPlaces}})$`);
    return floatOnly.test(amount) || amount === "";
  };

  const handleFromAmountChange = (amount: string) => {
    if (!isValidAmount(fromToken, amount)) {
      return;
    }

    const res = convertAmounts(fromToken, toToken, amount);
    setFromAmount(amount);
    setToAmount(res);
  };

  const handleToAmountChange = (amount: string) => {
    if (!isValidAmount(toToken, amount)) {
      return;
    }

    const res = convertAmounts(toToken, fromToken, amount);
    setToAmount(amount);
    setFromAmount(res);
  };

  return (
    <div className="flex flex-col flex-2 gap-y-4 rounded shadow-2xl px-8 py-10 max-w-xl min-w-l">
      <div className="text-lg mb-2">
        Price: 1 {fromToken.symbol} = {convertAmounts(fromToken, toToken, "1")} {toToken.symbol}
      </div>
      <ExchangeInputs
        label="From"
        tokens={fromTokenList}
        amount={fromAmount}
        selectedToken={fromToken}
        onTokenChange={handleFromTokenChange}
        onAmountChange={handleFromAmountChange}
      />
      <div className="self-center">
        <SwapButton onClick={handleTokenSwap} />
      </div>
      <ExchangeInputs
        label="To"
        tokens={toTokenList}
        amount={toAmount}
        selectedToken={toToken}
        onTokenChange={handleToTokenChange}
        onAmountChange={handleToAmountChange}
      />
    </div>
  );
}

export default ExchangeWidget;
