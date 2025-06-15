'use client';

import React, { useState, useMemo } from 'react';
import { DisplayPool, MeteoraPool, OrcaPool } from '@/lib/types';

interface PoolsTableProps {
  pools: DisplayPool[];
}

type SortKey = keyof DisplayPool;

const PoolsTable: React.FC<PoolsTableProps> = ({ pools }: { pools: DisplayPool[] }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'feeToTvlRatio', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredAndSortedPools = useMemo(() => {
    return pools
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [pools, sortConfig, filter]);

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
              <td className="p-2">${pool.tvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="p-2">${pool.dailyVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="p-2">${pool.dailyFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
