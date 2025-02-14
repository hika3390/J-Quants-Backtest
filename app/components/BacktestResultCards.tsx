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

// 基本情報カード
export function BasicInfoCard({ result }: { result: BacktestResult }) {
  return (
    <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">基本情報</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/60">戦略</span>
          <span className="text-white">{result.strategy}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">通貨ペア</span>
          <span className="text-white">{result.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">時間枠</span>
          <span className="text-white">{result.timeframe}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">期間</span>
          <span className="text-white">
            {result.startDate} 〜 {result.endDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// パフォーマンス指標カード
export function PerformanceCard({ result }: { result: BacktestResult }) {
  return (
    <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">パフォーマンス指標</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/60">総損益</span>
          <span className={`${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {result.profit >= 0 ? '+' : ''}{result.profit.toLocaleString()} USD
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">勝率</span>
          <span className="text-white">{result.winRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">取引回数</span>
          <span className="text-white">{result.totalTrades.toLocaleString()}回</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">最大ドローダウン</span>
          <span className="text-red-400">{result.maxDrawdown.toLocaleString()} USD</span>
        </div>
      </div>
    </div>
  );
}

// トレード統計カード
export function TradeStatsCard({ result }: { result: BacktestResult }) {
  return (
    <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">トレード統計</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/60">プロフィットファクター</span>
          <span className="text-white">{result.profitFactor.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">平均利益</span>
          <span className="text-green-400">+{result.averageWin.toLocaleString()} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">平均損失</span>
          <span className="text-red-400">{result.averageLoss.toLocaleString()} USD</span>
        </div>
      </div>
    </div>
  );
}

// リスク分析カード
export function RiskAnalysisCard({ result }: { result: BacktestResult }) {
  return (
    <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">リスク分析</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/60">リスク/リワード比率</span>
          <span className="text-white">1:{Math.abs(result.averageWin / result.averageLoss).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">最大ドローダウン率</span>
          <span className="text-white">
            {((Math.abs(result.maxDrawdown) / result.profit) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
