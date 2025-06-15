'use client';

import React, { useState, useMemo } from 'react';
import { DisplayPool, MeteoraPool, OrcaPool } from '@/lib/types';

interface PoolsTableProps {
  orcaPools: OrcaPool[];
  meteoraPools: MeteoraPool[];
}

type SortKey = keyof DisplayPool;

const PoolsTable: React.FC<PoolsTableProps> = ({ orcaPools, meteoraPools }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'feeToTvlRatio', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const combinedPools: DisplayPool[] = useMemo(() => {
    const pools = [
      ...orcaPools.map((p) => {
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
      ...meteoraPools.map((p) => {
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
      }),
    ];
    return pools;
  }, [orcaPools, meteoraPools]);

  const filteredAndSortedPools = useMemo(() => {
    return combinedPools
      .filter(pool => pool.dailyVolume >= 10000 && pool.tvl >= 10000)
      .filter((pool) => pool.name.toLowerCase().includes(filter.toLowerCase()))
      // Remove any pools where the fee/tvl ration is >100%, likely scam tokens
      .filter((pool) => pool.feeToTvlRatio <= 1)
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [combinedPools, sortConfig, filter]);

  const totalPages = Math.ceil(filteredAndSortedPools.length / itemsPerPage);
  const paginatedPools = filteredAndSortedPools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'desc' ? ' ↓' : ' ↑';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('protocol')}>Protocol{getSortIndicator('protocol')}</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('name')}>Pool{getSortIndicator('name')}</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('tvl')}>TVL (USD){getSortIndicator('tvl')}</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('dailyVolume')}>Volume (24h){getSortIndicator('dailyVolume')}</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('dailyFees')}>Fees (24h){getSortIndicator('dailyFees')}</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort('feeToTvlRatio')}>Fee/TVL (24h){getSortIndicator('feeToTvlRatio')}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPools.map((pool) => (
            <tr
              key={pool.address}
              onClick={() => window.open(pool.url, '_blank')}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <td className="p-2">{pool.protocol}</td>
              <td className="p-2">{pool.name}</td>
              <td className="p-2">${pool.tvl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="p-2">${pool.dailyVolume.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="p-2">${pool.dailyFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="p-2">{(pool.feeToTvlRatio * 100).toFixed(4)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PoolsTable;
