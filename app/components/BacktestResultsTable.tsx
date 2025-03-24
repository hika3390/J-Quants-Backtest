'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

import { BacktestResult } from '@/app/types/backtest';

const formatValue = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatMoney = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  return `${formatValue(value)}%`;
};

export default function BacktestResultsTable() {
  const router = useRouter();
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/backtest/list');
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        
        // データの有効性を確認
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          setResults([]);
          return;
        }

        // 必要なプロパティの存在を確認してフィルタリング
        const validResults = data.filter(result => {
          const isValid = result && 
            typeof result.code === 'string' &&
            typeof result.startDate === 'string' &&
            typeof result.endDate === 'string' &&
            typeof result.executedAt === 'string' &&
            typeof result.totalReturn === 'number' &&
            typeof result.winRate === 'number' &&
            typeof result.maxDrawdown === 'number' &&
            typeof result.sharpeRatio === 'number';

          if (!isValid) {
            console.warn('Invalid result data:', result);
          }
          return isValid;
        });

        setResults(validResults);
      } catch (err) {
        setError('バックテスト結果の取得に失敗しました');
        console.error('Error fetching results:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tokyo'
    });
  };

  const columns = [
    {
      accessorKey: 'executedAt',
      header: '実行日時',
      size: 180,
      cell: (info: any) => (
        <span className="text-slate-200 whitespace-nowrap">
          {formatDateTime(info.getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'code',
      header: '銘柄コード',
      size: 120,
      cell: (info: any) => <span className="text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'period',
      header: '期間',
      size: 200,
      cell: (info: any) => (
        <span className="text-slate-200 whitespace-nowrap">
          {info.row.original.startDate} 〜 {info.row.original.endDate}
        </span>
      ),
    },
    {
      accessorKey: 'totalReturn',
      header: '総リターン',
      size: 140,
      cell: (info: any) => {
        const value = info.getValue() as number;
        return (
          <span className={`whitespace-nowrap ${value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {value >= 0 ? '+' : ''}{formatPercent(value)}
          </span>
        );
      },
    },
    {
      accessorKey: 'winRate',
      header: '勝率',
      size: 120,
      cell: (info: any) => (
        <span className="text-slate-200 whitespace-nowrap">
          {formatPercent(info.getValue() as number)}
        </span>
      ),
    },
    {
      accessorKey: 'maxDrawdown',
      header: '最大ドローダウン',
      size: 160,
      cell: (info: any) => (
        <span className="text-rose-400 whitespace-nowrap">
          -{formatPercent(info.getValue() as number)}
        </span>
      ),
    },
    {
      accessorKey: 'sharpeRatio',
      header: 'シャープレシオ',
      size: 140,
      cell: (info: any) => (
        <span className="text-slate-200 whitespace-nowrap">
          {formatValue(info.getValue() as number)}
        </span>
      ),
    },
  ];

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
      sorting: [
        { id: 'executedAt', desc: true } // 実行日時の降順（新しい順）でソート
      ]
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
          className="w-full h-10 pl-10 pr-4 bg-slate-800 border-0 rounded-lg text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-slate-600"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
      </div>

      {isLoading && (
        <div className="text-center py-8 text-slate-400">
          データを読み込んでいます...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      )}

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
                onClick={() => router.push(`/results/${row.original.id}`)}
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
