export async function getPools() {
    // Get Orca pools
    const orcaApiUrl = "https://api.mainnet.orca.so/v1/whirlpool/list";
    const orcaResponse = await fetch(orcaApiUrl);
    const orcaData = await orcaResponse.json();
    const orcaPools = orcaData.whirlpools;

    // Get Meteora pools
    const meteoraApiUrl = "https://dlmm-api.meteora.ag/pair/all";
    const meteoraResponse = await fetch(meteoraApiUrl);
    const meteoraData = await meteoraResponse.json();
    const meteoraPools = meteoraData;

    return {
        orca: orcaPools,
        meteora: meteoraPools,
    };
} 