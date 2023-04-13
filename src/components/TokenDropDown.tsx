import React from "react";
import Image from "next/image";
import { TokenInfo } from "@/types";

interface Props {
  tokens: TokenInfo;
  onChange: (id: string) => void;
}

function TokenDropDown({ tokens, onChange }: Props) {
  function handleTokenSelect(id: string) {
    return () => {
      onChange(id);
    };
  }

  return (
    <div className="absolute right-0 border-2 w-400" data-testid="token-dropdown">
      <div className="flex flex-col">
        {Object.keys(tokens).map((tokenId, i) => {
          const { icon, symbol, name } = tokens[tokenId];
          return (
            <div key={i} className="bg-gray-100 hover:bg-cyan-300">
              <div className="flex flex-row gap-x-4 px-4 py-2" onClick={handleTokenSelect(tokenId)}>
                <Image src={icon} width={24} height={24} alt={`${symbol} logo`} />
                <span>{symbol}</span>
                <span className="font-light">{name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TokenDropDown;
