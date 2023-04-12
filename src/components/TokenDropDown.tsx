import React from "react";
import Image from "next/image";
import { Token } from "@/types";

interface Props {
  tokens: Token[];
  onChange: (e: Token) => void;
}

function TokenDropDown({ tokens, onChange }: Props) {
  function handleTokenSelect(token: Token) {
    return () => {
      onChange(token);
    };
  }

  return (
    <div className="absolute right-0 border-2 w-400">
      <div className="flex flex-col">
        {tokens.map((token, i) => (
          <div key={i} className="bg-gray-100 hover:bg-cyan-300">
            <div className="flex flex-row gap-x-4 px-4 py-2" onClick={handleTokenSelect(token)}>
              <Image src={token.icon} width={24} height={24} alt={""} />
              <span>{token.symbol}</span>
              <span className="font-light">{token.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenDropDown;
