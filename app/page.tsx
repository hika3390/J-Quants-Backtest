import BacktestSettings from './components/BacktestSettings';

export default async function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="p-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black tracking-tight">
            <span className="text-indigo-400">BACK</span>
            <span className="text-white/90">TEST</span>
            <span className="text-pink-400">SYSTEM</span>
          </h1>
          <div className="h-1 w-full max-w-2xl mx-auto bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mt-2" />
          <p className="mt-6 text-2xl text-white/90 font-medium tracking-wider">
            戦略を最適化し、<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">トレードの未来</span>を形作る
          </p>
        </div>
        <BacktestSettings />
      </div>
    </main>
  );
}
