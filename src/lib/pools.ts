export async function getPools() {
  // Get Orca pools
  const x = Date.now();
  const [orcaData, meteoraData] = await Promise.all([
    fetch("https://api.orca.so/v2/solana/pools").then((res) => res.json()),
    fetch("https://dlmm-api.meteora.ag/pair/all").then((res) => res.json()),
  ]);

  const orcaPools = orcaData.data;
  const meteoraPools = meteoraData;

  return {
    orca: orcaPools,
    meteora: meteoraPools,
  };
}
