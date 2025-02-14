import { Suspense } from 'react';
import { PageLayout } from '../components/PageLayout';
import SettingsForm from '../components/SettingsForm';

// ローディングスケルトン
function SettingsFormSkeleton() {
  return (
    <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl p-6 space-y-6 animate-pulse">
      {/* フォームグループのスケルトン */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-10 bg-white/10 rounded-lg" />
        </div>
      ))}

      {/* ボタンのスケルトン */}
      <div className="pt-4">
        <div className="h-10 w-full bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageLayout
      title="システム設定"
      subtitle="アプリケーションの基本設定を管理します"
    >
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<SettingsFormSkeleton />}>
          <div className="backdrop-blur-sm bg-white/10 rounded-xl shadow-xl">
            <SettingsForm />
          </div>
        </Suspense>
      </div>
    </PageLayout>
  );
}
