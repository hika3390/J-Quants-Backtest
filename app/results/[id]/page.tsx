import { PageLayout } from '@/app/components/PageLayout';
import {
  BasicInfoCard,
  PerformanceCard,
  TradeStatsCard,
  RiskAnalysisCard
} from '@/app/components/BacktestResultCards';

async function getBacktestResult(id: string) {
  // 注: 実際のアプリケーションでは、このデータはバックエンドから取得します
  return {
    id: String(id),
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
}

export default async function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const param = await params;
  const mockResult = await getBacktestResult(param.id);

  return (
    <PageLayout
      title="バックテスト結果"
      subtitle={`${mockResult.strategy} - ${mockResult.symbol}`}
      backLink={{
        href: "/results",
        label: "バックテスト一覧に戻る"
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInfoCard result={mockResult} />
        <PerformanceCard result={mockResult} />
        <TradeStatsCard result={mockResult} />
        <RiskAnalysisCard result={mockResult} />
      </div>
    </PageLayout>
  );
}
