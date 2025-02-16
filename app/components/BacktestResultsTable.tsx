'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
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

// モックデータ生成
const generateMockResults = (): BacktestResult[] => {
  const strategies = [
    'ゴールデンクロス戦略', 'RSI逆張り戦略', 'ブレイクアウト戦略',
    'MACDクロス戦略', 'ボリンジャーバンド戦略', 'トリプルクロス戦略',
  ];

  const symbols = [
    'USD/JPY', 'EUR/USD', 'GBP/JPY', 'BTC/USD', 'ETH/USD', 'XRP/USD'
  ];

  const timeframes = ['1分', '5分', '15分', '30分', '1時間', '4時間', '日足'];

  return Array.from({ length: 50 }, (_, i) => {
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

  const handleRowClick = useCallback((id: string) => {
    router.push(`/results/${id}`);
  }, [router]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  }, []);

  const columns = useMemo<ColumnDef<BacktestResult>[]>(() => [
    {
      accessorKey: 'strategy',
      header: '戦略',
      size: 240,
      cell: (info) => <span className="text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'symbol',
      header: '通貨ペア',
      size: 140,
      cell: (info) => <span className="text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'period',
      header: '期間',
      size: 240,
      cell: (info) => (
        <span className="text-slate-200 whitespace-nowrap">
          {info.row.original.startDate} 〜 {info.row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: 'profit',
      header: '損益',
      size: 160,
      cell: (info) => {
        const profit = info.getValue() as number;
        return (
          <span className={`whitespace-nowrap ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {profit >= 0 ? '+' : ''}{profit.toLocaleString()} USD
          </span>
        );
      },
    },
    {
      accessorKey: 'winRate',
      header: '勝率',
      size: 120,
      cell: (info) => (
        <span className="text-slate-200 whitespace-nowrap">
          {(info.getValue() as number).toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状態',
      size: 120,
      cell: (info) => {
        const status = info.getValue() as 'completed' | 'failed';
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            status === 'completed' 
              ? 'bg-emerald-400/10 text-emerald-400' 
              : 'bg-rose-400/10 text-rose-400'
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
          onChange={handleSearch}
          placeholder="検索..."
          className="w-full h-10 pl-10 pr-4 bg-slate-800 border-0 rounded-lg text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-slate-600"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
      </div>

      {/* テーブル */}
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          {/* ヘッダー */}
          <div className="border-b border-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-4 h-12 flex items-center text-sm font-medium text-slate-200 ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-slate-700/50' : ''
                    }`}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUpIcon className="h-4 w-4 text-slate-400" />,
                        desc: <ArrowDownIcon className="h-4 w-4 text-slate-400" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ボディ */}
          <div className="relative">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                className="flex border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex items-center px-4 h-12"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between px-4 h-12 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ページ
          </span>
          <span>
            （全{table.getFilteredRowModel().rows.length}件）
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`px-3 h-8 rounded text-sm font-medium transition-colors ${
              table.getCanPreviousPage()
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            前へ
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`px-3 h-8 rounded text-sm font-medium transition-colors ${
              table.getCanNextPage()
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
