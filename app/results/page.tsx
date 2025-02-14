import BacktestResultsTable from '../components/BacktestResultsTable';

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              <span className="text-white/90">バックテスト履歴</span>
            </h1>
            <div className="h-0.5 w-full max-w-xl mx-auto bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
            <p className="mt-4 text-lg text-white/60">
              過去のバックテスト結果一覧です
            </p>
          </div>
          <BacktestResultsTable />
        </div>
      </div>
    </main>
  );
}
