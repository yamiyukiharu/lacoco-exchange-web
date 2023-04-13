import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import Image from "next/image";

interface Props {
  symbol: string;
  icon: string;
  onClick: () => void;
}

function TokenSelector(props: Props) {
  const { symbol, icon, onClick } = props;

  return (
    <div
      data-testid="token-selector"
      className="h-full w-44 px-2 py-2 border-2 flex flex-row items-center hover:border-cyan-600 active:bg-cyan-200"
      onClick={onClick}
    >
      <Image src={icon} width={24} height={24} alt={`${symbol} logo`} />
      <div className="w-2"></div>
      <span>{symbol}</span>
      <div className="w-2"></div>
      <MdExpandMore size={30} />
    </div>
  );
}

export default TokenSelector;
