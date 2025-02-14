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
      <p className="mt-6 text-2xl text-white/90 font-medium tracking-wider">
        戦略を最適化し、
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
          トレードの未来
        </span>
        を形作る
      </p>
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
