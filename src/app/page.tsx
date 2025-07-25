import PoolsTable from "@/components/PoolsTable";
import { getPools } from "@/lib/pools";
import { MeteoraPool, OrcaPool } from "@/lib/types";

export const revalidate = 600; // revalidate every 10 minutes

export default async function Home() {
  const { orca, meteora } = await getPools();

  const pools = [
    ...orca.map((p: OrcaPool) => {
      const dailyFees = parseFloat(p.stats["24h"].fees);
      const tvl = parseFloat(p.tvlUsdc);
      return {
        protocol: 'Orca' as const,
        address: p.address,
        name: `${p.tokenA.symbol}-${p.tokenB.symbol}`,
        dailyFees,
        tvl,
        dailyVolume: parseFloat(p.stats["24h"].volume),
        feeToTvlRatio: tvl > 0 ? dailyFees / tvl : 0,
        url: `https://www.orca.so/pools/${p.address}`,
      };
    }),
    ...meteora.map((p: MeteoraPool) => {
      const dailyFees = p.fees_24h || 0;
      const tvl = parseFloat(p.liquidity) || 0;
      return {
        protocol: 'Meteora' as const,
        address: p.address,
        name: p.name,
        dailyFees,
        tvl,
        dailyVolume: p.trade_volume_24h || 0,
        feeToTvlRatio: tvl > 0 ? dailyFees / tvl : 0,
        url: `https://app.meteora.ag/dlmm/${p.address}`,
      };
    })
  ];

  const filteredPools = pools
    // Remove very low volume or TVL pools
    .filter(pool => pool.dailyVolume >= 30000 && pool.tvl >= 20000)
    // Remove any pools where the fee/tvl ration is >100%, likely scam tokens
    .filter((pool) => pool.feeToTvlRatio <= 0.2)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-8 tracking-wider">
          Orca Meteora Vibe Aggregator
        </h1>
        <p className="text-center text-sm text-gray-400">
          Pools with less than 30k USD daily volume or less than 20k USD TVL are excluded. Pools with a 24hr fee/tvl ratio greater than 20% are also excluded, as rug rates with these tokens are very high.
        </p>
      </div>
      <div className="w-full max-w-5xl border border-[#00f6ff] rounded-lg p-4 bg-black bg-opacity-50 shadow-[0_0_15px_rgba(0,246,255,0.5)]">
        <PoolsTable pools={filteredPools} />
      </div>
    </main>
  );
}
