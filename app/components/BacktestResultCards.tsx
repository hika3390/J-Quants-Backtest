import React from 'react';

interface BacktestResult {
  id: string;
  strategy: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  profit: number;
  winRate: number;
  totalTrades: number;
  maxDrawdown: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  status: string;
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-slate-800/50 rounded-xl shadow">
    <div className="px-5 py-4">
      <h2 className="text-lg font-medium text-white mb-4">{title}</h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  </div>
);

const DataItem = ({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) => (
  <div className="flex justify-between">
    <span className="text-slate-400">{label}</span>
    <span className={className}>{value}</span>
  </div>
);

export function BasicInfoCard({ result }: { result: BacktestResult }) {
  return (
    <Card title="基本情報">
      <DataItem label="戦略" value={result.strategy} className="text-white" />
      <DataItem label="通貨ペア" value={result.symbol} className="text-white" />
      <DataItem label="時間枠" value={result.timeframe} className="text-white" />
      <DataItem
        label="期間"
        value={`${result.startDate} 〜 ${result.endDate}`}
        className="text-white"
      />
    </Card>
  );
}

export function PerformanceCard({ result }: { result: BacktestResult }) {
  return (
    <Card title="パフォーマンス指標">
      <DataItem
        label="総損益"
        value={`${result.profit >= 0 ? '+' : ''}${result.profit.toLocaleString()} USD`}
        className={result.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
      />
      <DataItem
        label="勝率"
        value={`${result.winRate.toFixed(1)}%`}
        className="text-white"
      />
      <DataItem
        label="取引回数"
        value={`${result.totalTrades.toLocaleString()}回`}
        className="text-white"
      />
      <DataItem
        label="最大ドローダウン"
        value={`${result.maxDrawdown.toLocaleString()} USD`}
        className="text-rose-400"
      />
    </Card>
  );
}

export function TradeStatsCard({ result }: { result: BacktestResult }) {
  return (
    <Card title="トレード統計">
      <DataItem
        label="プロフィットファクター"
        value={result.profitFactor.toFixed(2)}
        className="text-white"
      />
      <DataItem
        label="平均利益"
        value={`+${result.averageWin.toLocaleString()} USD`}
        className="text-emerald-400"
      />
      <DataItem
        label="平均損失"
        value={`${result.averageLoss.toLocaleString()} USD`}
        className="text-rose-400"
      />
    </Card>
  );
}

export function RiskAnalysisCard({ result }: { result: BacktestResult }) {
  return (
    <Card title="リスク分析">
      <DataItem
        label="リスク/リワード比率"
        value={`1:${Math.abs(result.averageWin / result.averageLoss).toFixed(2)}`}
        className="text-white"
      />
      <DataItem
        label="最大ドローダウン率"
        value={`${((Math.abs(result.maxDrawdown) / result.profit) * 100).toFixed(1)}%`}
        className="text-white"
      />
    </Card>
  );
}
