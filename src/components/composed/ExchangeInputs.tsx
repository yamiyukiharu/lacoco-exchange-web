import React, { useEffect, useRef, useState } from "react";
import AmountInput from "@components/AmountInput";
import TokenSelector from "@/components/TokenSelector";
import { TokenInfo } from "@/types";
import TokenDropDown from "../TokenDropDown";

interface Props {
  label: string;
  tokens: TokenInfo;
  amount: string;
  selectedTokenId: string;
  onAmountChange: (e: string) => void;
  onSelectionChange: (id: string) => void;
}

function ExchangeInputs(props: Props) {
  const { label, tokens, amount, selectedTokenId, onAmountChange, onSelectionChange } = props;

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
    setDropDown((value) => !value);
  }

  function handleTokenChange(id: string) {
    onSelectionChange(id);
    setDropDown(false);
  }

  const { icon, symbol } = tokens[selectedTokenId];

  return (
    <div data-testid="widget-input">
      <div className="text-base font-light">{label}</div>
      <div className="h-12 flex flex-row gap-x-1 items-center justify-between">
        <AmountInput amount={amount} onChange={onAmountChange} />
        <TokenSelector icon={icon} symbol={symbol} onClick={handleTokenClick} />
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
