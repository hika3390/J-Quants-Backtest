import { PageLayout } from './components/PageLayout';
import BacktestSettings from './components/backtest/Settings';

export default function Home() {
  return (
    <PageLayout title="バックテスト設定" subtitle="バックテストの条件を設定します">
      <div className="mt-8">
        <BacktestSettings />
      </div>
    </PageLayout>
  );
}
