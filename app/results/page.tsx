import { PageLayout } from '@/app/components/PageLayout';
import BacktestResultsTable from '@/app/components/BacktestResultsTable';

export default function ResultsPage() {
  return (
    <PageLayout
      title="バックテスト履歴"
      subtitle="過去のバックテスト結果一覧です"
    >
      <div className="max-w-[calc(100vw-4rem)]">
        <BacktestResultsTable />
      </div>
    </PageLayout>
  );
}
