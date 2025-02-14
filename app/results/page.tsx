import { Suspense } from 'react';
import { PageLayout } from '../components/PageLayout';
import BacktestResultsTable from '../components/BacktestResultsTable';

// ローディングスケルトン
function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* 検索フィールドのスケルトン */}
      <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
      
      {/* テーブルのスケルトン */}
      <div className="overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm shadow-xl">
        <div className="border-b border-white/20">
          <div className="flex h-14 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-1 px-6 py-4"
              >
                <div className="h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex border-b border-white/10 animate-pulse">
              {[...Array(6)].map((_, j) => (
                <div
                  key={j}
                  className="flex-1 px-6 py-4"
                >
                  <div className="h-4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ページネーションのスケルトン */}
      <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <PageLayout
      title="バックテスト履歴"
      subtitle="過去のバックテスト結果一覧です"
    >
      <Suspense fallback={<TableSkeleton />}>
        <div className="max-w-[calc(100vw-4rem)]">
          <BacktestResultsTable />
        </div>
      </Suspense>
    </PageLayout>
  );
}
