import React from "react";

interface Props {
  amount: string;
  onChange: (e: string) => void;
}

function AmountInput({ amount, onChange }: Props) {
  return (
    <input
      type="tel"
      className="w-full h-full bg-opacity-10 border-2 text-lg p-2"
      value={amount}
      placeholder="0.0"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default AmountInput;
