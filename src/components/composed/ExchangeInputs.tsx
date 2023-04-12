import React, { useEffect, useRef, useState } from "react";
import AmountInput from "@components/AmountInput";
import TokenSelector from "@/components/TokenSelector";
import { Token } from "@/types";
import TokenDropDown from "../TokenDropDown";

interface Props {
  label: string;
  tokens: Token[];
  amount: string;
  selectedToken: Token;
  onAmountChange: (e: string) => void;
  onTokenChange: (e: Token) => void;
}

function ExchangeInputs(props: Props) {
  const { label, tokens, amount, selectedToken, onAmountChange, onTokenChange } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [dropDown, setDropDown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  function handleTokenClick() {
    setDropDown(value => !value);
  }

  function handleTokenChange(token: Token) {
    onTokenChange(token);
    setDropDown(false);
  }

  return (
    <div>
      <div className="text-base font-light">{label}</div>
      <div className="h-12 flex flex-row gap-x-1 items-center justify-between">
        <AmountInput amount={amount} onChange={onAmountChange} />
        <TokenSelector token={selectedToken} onClick={handleTokenClick}/>
      </div>

      {dropDown && (
        <div className="relative" ref={ref}>
          <TokenDropDown tokens={tokens} onChange={handleTokenChange} />
        </div>
      )}
    </div>
  );
}

export default ExchangeInputs;
