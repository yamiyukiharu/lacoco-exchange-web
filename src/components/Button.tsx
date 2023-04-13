import React from "react";

interface Props {
  label: string;
}

function Button({ label }: Props) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {label}
    </button>
  )
}

export default Button;
