import { Inter } from "next/font/google";
import Clock from "@/components/Clock";
import ExchangeWidget from "@/components/composed/ExchangeWidget";
import useTokenPrices from "@/hooks/useTokenPrices";
import { useEffect, useState } from "react";
import { useTokenInfo } from "@/hooks/useTokenInfo";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { tokenPrices } = useTokenPrices();
  const { tokenInfo } = useTokenInfo();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row content-start items-center gap-x-10 gap-y-10 justify-between md:p-8 lg:p-10 xl:p-14 2xl:p-40 p-6">
        <div className="flex flex-col gap-y-10 flex-1 items-start">
          <h1 className="text-6xl font-bold">La Coco Crypto Exchange</h1>
          <p className="text-2xl font-bold">Swap your favourite crypto easily with the best rates</p>
          {mounted && <Clock />}
        </div>
        {tokenInfo && tokenPrices && <ExchangeWidget tokens={tokenInfo} prices={tokenPrices} />}
      </div>
    </main>
  );
}
