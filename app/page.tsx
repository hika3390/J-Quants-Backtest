import { PageLayout } from './components/PageLayout';
import BacktestSettings from './components/backtest/Settings';

// カスタムタイトル
function HomeTitle() {
  return (
    <div className="text-center -mt-4">
      <h1 className="text-7xl font-black tracking-tight">
        <span className="text-indigo-400">BACK</span>
        <span className="text-white/90">TEST</span>
        <span className="text-pink-400">SYSTEM</span>
      </h1>
      <div className="h-1 w-full max-w-2xl mx-auto bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mt-2" />
    </div>
  );
}

export default function Home() {
  return (
    <PageLayout title={<HomeTitle />}>
      <div className="mt-8">
        <BacktestSettings />
      </div>
    </PageLayout>
  );
}
