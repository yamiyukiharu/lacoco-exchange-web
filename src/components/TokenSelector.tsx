import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { Token } from "@/types";
import Image from "next/image";
import { Listbox } from "@headlessui/react";

interface Props {
  token: Token;
  onClick: () => void;
}

function TokenSelector(props: Props) {
  const { token, onClick } = props;

  const { symbol, icon } = token;

  return (
    <div
      className="h-full w-44 px-2 py-2 border-2 flex flex-row items-center hover:border-cyan-600 active:bg-cyan-200"
      onClick={onClick}
    >
      <Image src={icon} width={24} height={24} alt={""} />
      <div className="w-2"></div>
      <span>{symbol}</span>
      <div className="w-2"></div>
      <MdExpandMore size={30} />
    </div>
  );
}

export default TokenSelector;
