export interface OrcaToken {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  coingeckoId: string;
  whitelisted: boolean;
  poolToken: boolean;
  token2022: boolean;
}

export interface OrcaPool {
  address: string;
  feeGrowthGlobalA: string;
  feeGrowthGlobalB: string;
  feeRate: number;
  liquidity: string;
  protocolFeeOwedA: string;
  protocolFeeOwedB: string;
  protocolFeeRate: number;
  rewardLastUpdatedTimestamp: string;
  sqrtPrice: string;
  tickCurrentIndex: number;
  tickSpacing: number;
  tickSpacingSeed: string;
  tokenMintA: string;
  tokenMintB: string;
  tokenVaultA: number[];
  tokenVaultB: string;
  updatedAt: string;
  updatedSlot: number;
  whirlpoolBump: string;
  whirlpoolsConfig: string;
  writeVersion: string;
  adaptiveFee: null | string;
  adaptiveFeeEnabled: boolean;
  feeTierIndex: number;
  hasWarning: boolean;
  lockedLiquidityPercent: {
    lockedPercentage: string;
    name: string;
  }[];
  poolType: string;
  price: string;
  rewards: {
    authority: string;
    emissions_per_second_x64: string;
    growth_global_x64: string;
    mint: string;
    vault: string;
    active: boolean;
    emissionsPerSecond: string;
  }[];
  stats: {
    "24h": {
      volume: string;
      fees: string;
      rewards: null;
      yieldOverTvl: string;
    };
  };
  tokenA: {
    address: string;
    decimals: number;
    imageUrl: string;
    name: string;
    programId: string;
    symbol: string;
    tags: string;
  };
  tokenB: {
    address: string;
    decimals: number;
    imageUrl: string;
    name: string;
    programId: string;
    symbol: string;
    tags: string;
  };
  tokenBalanceA: string;
  tokenBalanceB: string;
  tradeEnableTimestamp: string;
  tvlUsdc: string;
  yieldOverTvl: string;
}

export interface MeteoraPool {
  address: string;
  name: string;
  mint_x: string;
  mint_y: string;
  reserve_x_amount: number;
  reserve_y_amount: number;
  liquidity: string;
  fees_24h: number;
  trade_volume_24h: number;
  current_price: number;
  apr: number;
  apy: number;
}

export interface DisplayPool {
  protocol: "Orca" | "Meteora";
  address: string;
  name: string;
  dailyFees: number;
  tvl: number;
  dailyVolume: number;
  feeToTvlRatio: number;
  url: string;
}
