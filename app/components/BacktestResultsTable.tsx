'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Column,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

// モックデータの型定義
interface BacktestResult {
  id: string;
  strategy: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  profit: number;
  winRate: number;
  status: 'completed' | 'failed';
}

// モックデータ
// モックデータ生成
const generateMockResults = (): BacktestResult[] => {
  const strategies = [
    'ゴールデンクロス戦略',
    'RSI逆張り戦略',
    'ブレイクアウト戦略',
    'MACDクロス戦略',
    'ボリンジャーバンド戦略',
    'トリプルクロス戦略',
    'エンベロープ戦略',
    'ピボットポイント戦略',
    'フィボナッチリトレースメント戦略',
    'トレンドライン戦略'
  ];

  const symbols = [
    'USD/JPY',
    'EUR/USD',
    'GBP/JPY',
    'AUD/USD',
    'BTC/USD',
    'ETH/USD',
    'XRP/USD',
    'EUR/JPY',
    'GBP/USD',
    'CHF/JPY'
  ];

  const timeframes = ['1分', '5分', '15分', '30分', '1時間', '4時間', '日足', '週足'];

  return Array.from({ length: 25 }, (_, i) => {
    const startDate = new Date(2024, 0, Math.floor(Math.random() * 30) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 1);

    const profit = Math.floor(Math.random() * 10000) - 3000;
    const winRate = 35 + Math.random() * 40;

    return {
      id: String(i + 1),
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      profit,
      winRate,
      status: profit > 0 && winRate > 50 ? 'completed' : 'failed',
    };
  });
};

export default function BacktestResultsTable() {
  const router = useRouter();
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    setResults(generateMockResults());
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/results/${id}`);
  };

  const columns = useMemo<ColumnDef<BacktestResult>[]>(() => [
    {
      accessorKey: 'strategy',
      header: '戦略',
      cell: (info) => <span className="text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'symbol',
      header: '通貨ペア',
      cell: (info) => <span className="text-white">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'period',
      header: '期間',
      cell: (info) => (
        <span className="text-white whitespace-nowrap">
          {info.row.original.startDate} 〜 {info.row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: 'profit',
      header: '損益',
      cell: (info) => {
        const profit = info.getValue() as number;
        return (
          <span className={`whitespace-nowrap ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : ''}{profit.toLocaleString()} USD
          </span>
        );
      },
    },
    {
      accessorKey: 'winRate',
      header: '勝率',
      cell: (info) => (
        <span className="text-white whitespace-nowrap">
          {(info.getValue() as number).toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状態',
      cell: (info) => {
        const status = info.getValue() as 'completed' | 'failed';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'completed' 
              ? 'bg-green-400/10 text-green-400' 
              : 'bg-red-400/10 text-red-400'
          }`}>
            {status === 'completed' ? '完了' : '失敗'}
          </span>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* 検索フィールド */}
      <div className="relative">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="検索..."
          className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
      </div>

      {/* テーブル */}
      <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm shadow-xl">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-white/20">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-6 py-4 text-left text-sm font-semibold text-white ${
                      header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUpIcon className="h-4 w-4" />,
                        desc: <ArrowDownIcon className="h-4 w-4" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-lg">
        <div className="flex items-center gap-4 text-sm text-white">
          <span className="flex items-center gap-2">
            <span className="text-white/60">全</span>
            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
            <span className="text-white/60">件</span>
            {globalFilter && (
              <>
                <span className="text-white/60">（検索結果：全</span>
                <span className="font-medium">{results.length}</span>
                <span className="text-white/60">件中）</span>
              </>
            )}
          </span>
          <span className="text-white/60">|</span>
          <span>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`px-3 py-1 rounded-md text-sm ${
              table.getCanPreviousPage()
                ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                : 'bg-white/5 text-white/40 cursor-not-allowed'
            }`}
          >
            前へ
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`px-3 py-1 rounded-md text-sm ${
              table.getCanNextPage()
                ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                : 'bg-white/5 text-white/40 cursor-not-allowed'
            }`}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
