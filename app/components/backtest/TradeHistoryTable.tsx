import { Trade } from '@/app/lib/backtest/engine';
import { useState, useMemo } from 'react';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ja-JP');
};

const formatMoney = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) return '¥0';
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
};

interface TradeHistoryTableProps {
  trades: Trade[];
}

const ITEMS_PER_PAGE = 25;

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // ページネーション用の計算
  const totalPages = Math.ceil((trades?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrades = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    // 日付で降順ソート（新しいものから古いもの順）
    const sortedTrades = [...trades].sort((a, b) => {
      const dateA = new Date(a.entryDate).getTime();
      const dateB = new Date(b.entryDate).getTime();
      return dateB - dateA; // 降順
    });
    return sortedTrades.slice(startIndex, endIndex);
  }, [trades, startIndex, endIndex]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // ページネーションボタンの範囲を計算
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for(let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };
  return (
    <div className="space-y-4">
      {/* ページ情報とヘッダー */}
      {trades && trades.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {trades.length}件中 {startIndex + 1}-{Math.min(endIndex, trades.length)}件を表示
          </div>
          <div className="text-sm text-gray-400">
            ページ {currentPage} / {totalPages}
          </div>
        </div>
      )}

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-2 text-left">エントリー日</th>
              <th className="px-4 py-2 text-left">決済日</th>
              <th className="px-4 py-2 text-right">数量</th>
              <th className="px-4 py-2 text-right">エントリー価格</th>
              <th className="px-4 py-2 text-right">決済価格</th>
              <th className="px-4 py-2 text-right">損益</th>
              <th className="px-4 py-2 text-right">リターン</th>
              <th className="px-4 py-2 text-center">決済理由</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {currentTrades && currentTrades.length > 0 ? currentTrades.map((trade, index) => (
              <tr key={startIndex + index} className="hover:bg-slate-700">
                <td className="px-4 py-2">{formatDate(trade?.entryDate)}</td>
                <td className="px-4 py-2">{formatDate(trade?.exitDate)}</td>
                <td className="px-4 py-2 text-right">{trade?.quantity ? trade.quantity.toLocaleString() : '0'}</td>
                <td className="px-4 py-2 text-right">{formatMoney(trade?.entryPrice)}</td>
                <td className="px-4 py-2 text-right">{formatMoney(trade?.exitPrice)}</td>
                <td className={`px-4 py-2 text-right ${(trade?.profitLoss || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatMoney(trade?.profitLoss)}
                </td>
                <td className={`px-4 py-2 text-right ${(trade?.returnPercent || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(trade?.returnPercent)}
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade?.exitReason === 'take_profit' ? 'bg-green-800 text-green-200' :
                    trade?.exitReason === 'stop_loss' ? 'bg-red-800 text-red-200' :
                    'bg-blue-800 text-blue-200'
                  }`}>
                    {trade?.exitReason === 'take_profit' ? '利確' :
                     trade?.exitReason === 'stop_loss' ? '損切り' :
                     '売り条件'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  取引履歴がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          {/* 前のページボタン */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm rounded-md ${
              currentPage === 1
                ? 'text-gray-500 cursor-not-allowed bg-slate-800'
                : 'text-gray-300 hover:text-white hover:bg-slate-700 bg-slate-800'
            }`}
          >
            前へ
          </button>

          {/* ページ番号ボタン */}
          {getPageNumbers().map((pageNum, index) => (
            <span key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => goToPage(pageNum as number)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700 bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              )}
            </span>
          ))}

          {/* 次のページボタン */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm rounded-md ${
              currentPage === totalPages
                ? 'text-gray-500 cursor-not-allowed bg-slate-800'
                : 'text-gray-300 hover:text-white hover:bg-slate-700 bg-slate-800'
            }`}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
