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
  tokenA: OrcaToken;
  tokenB: OrcaToken;
  whitelisted: boolean;
  token2022: boolean;
  tickSpacing: number;
  price: number;
  lpFeeRate: number;
  protocolFeeRate: number;
  whirlpoolsConfig: string;
  modifiedTimeMs: number;
  tvl: number;
  volume: {
    day: number;
    week: number;
    month: number;
  };
  feeApr: {
    day: number;
    week: number;
    month: number;
  };
  totalApr: {
    day: number;
    week: number;
    month: number;
  };
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
  protocol: 'Orca' | 'Meteora';
  address: string;
  name: string;
  dailyFees: number;
  tvl: number;
  dailyVolume: number;
  feeToTvlRatio: number;
  url: string;
} 