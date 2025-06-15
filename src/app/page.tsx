import PoolsTable from "@/components/PoolsTable";
import { getPools } from "@/lib/pools";

export const revalidate = 600; // revalidate every 10 minutes

export default async function Home() {
  const pools = await getPools();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-8 tracking-wider">
          Solfi Pulse
        </h1>
      </div>
      <div className="w-full max-w-5xl border border-[#00f6ff] rounded-lg p-4 bg-black bg-opacity-50 shadow-[0_0_15px_rgba(0,246,255,0.5)]">
        <PoolsTable orcaPools={pools.orca} meteoraPools={pools.meteora} />
      </div>
    </main>
  );
}
