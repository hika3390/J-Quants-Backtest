'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import debounce from 'lodash/debounce';
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
    'USD/JPY', 'EUR/USD', 'GBP/JPY', 'AUD/USD',
    'BTC/USD', 'ETH/USD', 'XRP/USD', 'EUR/JPY',
    'GBP/USD', 'CHF/JPY'
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
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(generateMockResults());
  }, []);

  const handleRowClick = useCallback((id: string) => {
    router.push(`/results/${id}`);
  }, [router]);

  const debouncedSetGlobalFilter = useMemo(
    () => debounce((value: string) => {
      setGlobalFilter(value);
    }, 200),
    []
  );

  const columns = useMemo<ColumnDef<BacktestResult>[]>(() => [
    {
      accessorKey: 'strategy',
      header: '戦略',
      size: 200,
      cell: (info) => <span className="text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'symbol',
      header: '通貨ペア',
      size: 120,
      cell: (info) => <span className="text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'period',
      header: '期間',
      size: 200,
      cell: (info) => (
        <span className="text-slate-200 whitespace-nowrap">
          {info.row.original.startDate} 〜 {info.row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: 'profit',
      header: '損益',
      size: 150,
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
      size: 100,
      cell: (info) => (
        <span className="text-slate-200 whitespace-nowrap">
          {(info.getValue() as number).toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状態',
      size: 100,
      cell: (info) => {
        const status = info.getValue() as 'completed' | 'failed';
        return (
          <div className={`text-xs font-medium inline-block px-2 py-1 rounded ${
            status === 'completed'
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-rose-400/10 text-rose-400'
          }`}>
            {status === 'completed' ? '完了' : '失敗'}
          </div>
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
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  const { rows } = table.getRowModel();
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(() => 48, []),
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="space-y-4">
      {/* 検索フィールド */}
      <div className="relative">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => debouncedSetGlobalFilter(e.target.value)}
          placeholder="検索..."
          className="w-full h-10 pl-10 pr-4 bg-slate-800 border-0 rounded-lg text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-slate-600"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
      </div>

      {/* テーブル */}
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden">
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
                  style={{
                    width: header.getSize(),
                  }}
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
        <div
          ref={tableContainerRef}
          className="overflow-auto"
          style={{ height: '480px' }}
        >
          {rows.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-400">
              データが見つかりません
            </div>
          ) : (
            <div
              style={{
                height: `${totalSize}px`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  paddingTop: `${paddingTop}px`,
                  paddingBottom: `${paddingBottom}px`,
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      onClick={() => handleRowClick(row.original.id)}
                      className="absolute top-0 left-0 flex w-full border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer"
                      style={{
                        height: '48px',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          className="flex items-center px-4"
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ステータスバー */}
      <div className="bg-slate-800 rounded-lg px-4 h-10 flex items-center text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <span>全</span>
          <span className="font-medium text-slate-200">{table.getFilteredRowModel().rows.length}</span>
          <span>件</span>
          {globalFilter && (
            <>
              <span>（検索結果：全</span>
              <span className="font-medium text-slate-200">{results.length}</span>
              <span>件中）</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
