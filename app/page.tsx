import { PageLayout } from './components/PageLayout';
import BacktestSettings from './components/backtest/Settings';

export default function Home() {
  return (
    <PageLayout title="ホーム">
      <div className="mt-8">
        <BacktestSettings />
      </div>
    </PageLayout>
  );
}
