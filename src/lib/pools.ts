export async function getPools() {
  // Get Orca pools
  const x = Date.now();
  const [orcaData, meteoraData] = await Promise.all([
    fetch("https://api.mainnet.orca.so/v1/whirlpool/list").then((res) =>
      res.json()
    ),
    fetch("https://dlmm-api.meteora.ag/pair/all").then((res) => res.json()),
  ]);

  console.log("Time taken:", Date.now() - x);

  const orcaPools = orcaData.whirlpools;
  const meteoraPools = meteoraData;

  return {
    orca: orcaPools,
    meteora: meteoraPools,
  };
}
