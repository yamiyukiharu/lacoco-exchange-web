import React from "react";
import { MdSwapVert } from "react-icons/md";

interface Props {
  onClick: () => void;
}

function SwapButton({ onClick }: Props) {
  return (
    <button
      className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center"
      onClick={onClick}
    >
      <MdSwapVert size={30} />
    </button>
  );
}

export default SwapButton;
