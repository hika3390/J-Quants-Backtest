import Link from 'next/link';
import {
  BasicInfoCard,
  PerformanceCard,
  TradeStatsCard,
  RiskAnalysisCard
} from '@/app/components/BacktestResultCards';

export default async function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // パラメータを待機
  const resolvedParams = await params;
  
  // 注: 実際のアプリケーションでは、このデータはバックエンドから取得します
  const mockResult = {
    id: String(resolvedParams.id),
    strategy: 'ゴールデンクロス戦略',
    symbol: 'USD/JPY',
    timeframe: '1時間',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    profit: 2500,
    winRate: 65.5,
    totalTrades: 124,
    maxDrawdown: -1200,
    profitFactor: 1.85,
    averageWin: 450,
    averageLoss: -280,
    status: 'completed',
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/results"
              className="inline-flex items-center text-white/60 hover:text-white transition-colors gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
            >
              <span className="text-lg">←</span>
              <span>バックテスト一覧に戻る</span>
            </Link>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tight text-white/90 mb-4">
              バックテスト結果
            </h1>
            <p className="text-lg text-white/60">
              {mockResult.strategy} - {mockResult.symbol}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicInfoCard result={mockResult} />
            <PerformanceCard result={mockResult} />
            <TradeStatsCard result={mockResult} />
            <RiskAnalysisCard result={mockResult} />
          </div>
        </div>
      </div>
    </main>
  );
}
