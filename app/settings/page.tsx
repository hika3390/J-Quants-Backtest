import SettingsForm from '../components/SettingsForm';

export default async function SettingsPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              <span className="text-white/90">システム設定</span>
            </h1>
            <div className="h-0.5 w-full max-w-xl mx-auto bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" />
            <p className="mt-4 text-lg text-white/60">
              アプリケーションの基本設定を管理します
            </p>
          </div>
          <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl">
            <SettingsForm />
          </div>
        </div>
      </div>
    </main>
  );
}
