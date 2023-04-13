import _ from "lodash";
import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import SwapButton from "@components/SwapButton";
import ExchangeInputs from "@components/composed/ExchangeInputs";
import { convertAmounts } from "@/utils/convertAmounts";
import { TokenInfo, TokenPrices } from "@/types";
import Button from "../Button";

interface Props {
  tokens: TokenInfo;
  prices: TokenPrices;
}

function ExchangeWidget({ tokens, prices }: Props) {
  const tokenIds = Object.keys(tokens);
  const [fromTokenList, setFromTokenList] = useState(_.omit(tokens, tokenIds[0]) as TokenInfo);
  const [toTokenList, setToTokenList] = useState(_.omit(tokens, tokenIds[1]) as TokenInfo);

  const [fromTokenId, setFromTokenId] = useState(tokenIds[1]);
  const [toTokenId, setToTokenId] = useState(tokenIds[0]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  useEffect(() => {
    const toToken = tokens[toTokenId];
    const res = convertAmounts(fromAmount, prices[fromTokenId], prices[toTokenId], toToken.decimals);
    setToAmount(res);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  const handleFromTokenChange = (tokenId: string) => {
    // account for change in decimal places of different tokens
    const fromToken = tokens[tokenId];
    const toToken = tokens[toTokenId];
    const newFromAmount =
      fromAmount == ""
        ? ""
        : new BigNumber(fromAmount).decimalPlaces(fromToken.decimals, BigNumber.ROUND_DOWN).toString();

    const res = convertAmounts(newFromAmount, prices[tokenId], prices[toTokenId], toToken.decimals);
    setFromAmount(newFromAmount);
    setToAmount(res);
    setFromTokenId(tokenId);
    setToTokenList(_.omit(tokens, tokenId) as TokenInfo);
  };

  const handleToTokenChange = (tokenId: string) => {
    // We prioritise fromAmount, so update toAmount when toTokenId changes
    const toToken = tokens[tokenId];
    const res = convertAmounts(fromAmount, prices[fromTokenId], prices[tokenId], toToken.decimals);
    setToAmount(res);
    setToTokenId(tokenId);
    setFromTokenList(_.omit(tokens, tokenId) as TokenInfo);
  };

  const handleTokenSwap = () => {
    // keep fromAmount constant and update only toAmount
    const fromToken = tokens[fromTokenId];
    setFromTokenId(toTokenId);
    setToTokenId(fromTokenId);
    setToAmount(convertAmounts(fromAmount, prices[toTokenId], prices[fromTokenId], fromToken.decimals));
    setFromTokenList(_.omit(tokens, fromTokenId) as TokenInfo);
    setToTokenList(_.omit(tokens, toTokenId) as TokenInfo);
  };

  const isValidAmount = (amount: string, tokenDecimals: number) => {
    const floatOnly = new RegExp(`^(?:\\d+|\\d*\\.\\d{0,${tokenDecimals}})$`);
    return floatOnly.test(amount) || amount === "";
  };

  const handleFromAmountChange = (amount: string) => {
    const fromToken = tokens[fromTokenId];
    const toToken = tokens[toTokenId];
    if (!isValidAmount(amount, fromToken.decimals)) {
      return;
    }

    const res = convertAmounts(amount, prices[fromTokenId], prices[toTokenId], toToken.decimals);
    setFromAmount(amount);
    setToAmount(res);
  };

  const handleToAmountChange = (amount: string) => {
    const fromToken = tokens[fromTokenId];
    const toToken = tokens[toTokenId];
    if (!isValidAmount(amount, toToken.decimals)) {
      return;
    }

    const res = convertAmounts(amount, prices[toTokenId], prices[fromTokenId], fromToken.decimals);
    setToAmount(amount);
    setFromAmount(res);
  };

  return (
    <div className="flex flex-col flex-2 gap-y-4 rounded shadow-2xl px-8 py-10 max-w-xl min-w-l">
      <div className="text-lg mb-2">
        Price: 1 {tokens[fromTokenId].symbol} ={" "}
        {convertAmounts("1", prices[fromTokenId], prices[toTokenId], tokens[toTokenId].decimals)}{" "}
        {tokens[toTokenId].symbol}
      </div>
      <ExchangeInputs
        label="From"
        tokens={fromTokenList}
        amount={fromAmount}
        selectedTokenId={fromTokenId}
        onSelectionChange={handleFromTokenChange}
        onAmountChange={handleFromAmountChange}
      />
      <div className="self-center">
        <SwapButton onClick={handleTokenSwap} />
      </div>
      <ExchangeInputs
        label="To"
        tokens={toTokenList}
        amount={toAmount}
        selectedTokenId={toTokenId}
        onSelectionChange={handleToTokenChange}
        onAmountChange={handleToAmountChange}
      />
      <div className="h-2"/>
      <Button label="Exchange"/>
    </div>
  );
}

export default ExchangeWidget;
