import _ from "lodash";
import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import SwapButton from "@components/SwapButton";
import ExchangeInputs from "@components/composed/ExchangeInputs";
import { TokenInfo, TokenPrices } from "@/types";
import Button from "../Button";

interface Props {
  tokens: TokenInfo;
  prices: TokenPrices;
}

function ExchangeWidget({ tokens, prices }: Props) {
  const tokenIds = Object.keys(tokens);

  const filterTokens = (id: string) => _.omit(tokens, id) as TokenInfo;

  const isValidAmount = (amount: string, tokenId: string) => {
    const { decimals } = tokens[tokenId];
    const floatOnly = new RegExp(`^(?:\\d+|\\d*\\.\\d{0,${decimals}})$`);
    return floatOnly.test(amount) || amount === "";
  };

  const convertAmounts = (amount: string, fromTokenId: string, toTokenId: string): string => {
    if (amount == "") {
      return "";
    }

    const fromPrice = prices[fromTokenId];
    const toPrice = prices[toTokenId];
    const decimals = tokens[toTokenId].decimals;

    return new BigNumber(amount)
      .multipliedBy(fromPrice)
      .dividedBy(toPrice)
      .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
      .toString();
  };

  const [fromTokenList, setFromTokenList] = useState(filterTokens(tokenIds[0]));
  const [toTokenList, setToTokenList] = useState(filterTokens(tokenIds[1]));

  const [fromTokenId, setFromTokenId] = useState(tokenIds[1]);
  const [toTokenId, setToTokenId] = useState(tokenIds[0]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  useEffect(() => {
    setToAmount(convertAmounts(fromAmount, fromTokenId, toTokenId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]);

  const handleFromTokenChange = (tokenId: string) => {
    // account for change in decimal places of different tokens
    const { decimals } = tokens[tokenId];
    const newFromAmount =
      fromAmount == "" ? "" : new BigNumber(fromAmount).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toString();

    setFromTokenId(tokenId);
    setFromAmount(newFromAmount);
    setToTokenList(filterTokens(tokenId));
    setToAmount(convertAmounts(newFromAmount, tokenId, toTokenId));
  };

  const handleToTokenChange = (tokenId: string) => {
    // We prioritise fromAmount, so update toAmount when toTokenId changes
    setToTokenId(tokenId);
    setFromTokenList(filterTokens(tokenId));
    setToAmount(convertAmounts(fromAmount, fromTokenId, tokenId));
  };

  const handleTokenSwap = () => {
    // keep fromAmount constant and update only toAmount
    setFromTokenId(toTokenId);
    setToTokenId(fromTokenId);
    setFromTokenList(filterTokens(fromTokenId));
    setToTokenList(filterTokens(toTokenId));
    setToAmount(convertAmounts(fromAmount, toTokenId, fromTokenId));
  };

  const handleFromAmountChange = (amount: string) => {
    if (!isValidAmount(amount, fromTokenId)) return;

    setFromAmount(amount);
    setToAmount(convertAmounts(amount, fromTokenId, toTokenId));
  };

  const handleToAmountChange = (amount: string) => {
    if (!isValidAmount(amount, toTokenId)) return;

    setToAmount(amount);
    setFromAmount(convertAmounts(amount, toTokenId, fromTokenId));
  };

  return (
    <div className="flex flex-col flex-2 gap-y-4 rounded shadow-2xl px-8 py-10 max-w-xl min-w-l" data-testid="widget">
      <div className="text-lg mb-2" data-testid="price">
        Price: 1 {tokens[fromTokenId].symbol} = {convertAmounts("1", fromTokenId, toTokenId)} {tokens[toTokenId].symbol}
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
      <div className="h-2" />
      <Button label="Exchange" />
    </div>
  );
}

export default ExchangeWidget;
