import PoolsTable from "@/components/PoolsTable";
import { getPools } from "@/lib/pools";
import { MeteoraPool, OrcaPool } from "@/lib/types";

export const revalidate = 600; // revalidate every 10 minutes

export default async function Home() {
  const { orca, meteora } = await getPools();

  const pools = [
    ...orca.map((p: OrcaPool) => {
      const dailyFees = (p.volume?.day || 0) * p.lpFeeRate;
      const tvl = p.tvl || 0;
      return {
        protocol: 'Orca' as const,
        address: p.address,
        name: `${p.tokenA.symbol}-${p.tokenB.symbol}`,
        dailyFees,
        tvl,
        dailyVolume: p.volume?.day || 0,
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
    .filter((pool) => pool.feeToTvlRatio <= 1)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-8 tracking-wider">
          Orca Meteora Vibe Aggregator
        </h1>
      </div>
      <div className="w-full max-w-5xl border border-slate-800 rounded-lg p-4 bg-black bg-opacity-20 shadow-lg shadow-slate-900/50">
        <PoolsTable pools={filteredPools} />
      </div>
    </main>
  );
}
