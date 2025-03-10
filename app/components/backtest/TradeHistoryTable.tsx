import { Trade } from '@/app/lib/backtest/engine';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ja-JP');
};

const formatMoney = (value: number) => {
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatPercent = (value: number) => {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
};

interface TradeHistoryTableProps {
  trades: Trade[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {trades.map((trade, index) => (
            <tr key={index} className="hover:bg-slate-700">
              <td className="px-4 py-2">{formatDate(trade.entryDate)}</td>
              <td className="px-4 py-2">{formatDate(trade.exitDate)}</td>
              <td className="px-4 py-2 text-right">{trade.quantity.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{formatMoney(trade.entryPrice)}</td>
              <td className="px-4 py-2 text-right">{formatMoney(trade.exitPrice)}</td>
              <td className={`px-4 py-2 text-right ${trade.profitLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatMoney(trade.profitLoss)}
              </td>
              <td className={`px-4 py-2 text-right ${trade.returnPercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(trade.returnPercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
