'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import StockChart from '@/app/components/backtest/StockChart';
import TradeHistoryTable from '@/app/components/backtest/TradeHistoryTable';
import { indicators } from '@/app/constants/indicators';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BacktestResult as BacktestResultType } from '@/app/types/backtest';

// Chart.jsの設定
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatMoney = (value: number | null | undefined) => {
  if (value == null) return '-';
  return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatPercent = (value: number | null | undefined) => {
  if (value == null) return '-';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#94a3b8'
      }
    },
    title: {
      display: true,
      text: '資金推移',
      color: '#94a3b8'
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      beginAtZero: false,
      grid: {
        color: '#334155'
      },
      ticks: {
        color: '#94a3b8',
        callback: function(value: string | number) {
          return formatMoney(Number(value));
        },
      },
    },
    x: {
      grid: {
        color: '#334155'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  },
};

export default function BacktestResult() {
  const params = useParams();
  const [result, setResult] = useState<BacktestResultType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/backtest/${params.id}`);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'データの取得に失敗しました');
        }

        // レスポンスの型チェック（新しいAPIは直接データを返す）
        if (!json || typeof json !== 'object') {
          throw new Error('無効なデータ形式です');
        }

        // 必須プロパティの存在チェック
        const required = [
          'initialCash',
          'finalEquity',
          'totalReturn',
          'winRate',
          'maxDrawdown',
          'sharpeRatio',
          'trades',
          'priceData',
          'dates',
          'equity',
        ];

        for (const prop of required) {
          if (!(prop in json)) {
            throw new Error(`必須プロパティ ${prop} が見つかりません`);
          }
        }

        setResult(json as BacktestResultType);
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-slate-400">
          データを読み込んでいます...
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error || 'データの取得に失敗しました'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">バックテスト結果</h1>
        <p className="text-slate-400">
          実行日時: {new Date(result.executedAt).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Tokyo'
          })}
        </p>
      </div>

      {/* パフォーマンス指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">収益性</h3>
          <div className="space-y-2">
            <p>初期資金: {formatMoney(result.initialCash)}</p>
            <p>最終残高: {formatMoney(result.finalEquity)}</p>
            <p>総リターン: {formatPercent(result.totalReturn)}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">トレード統計</h3>
          <div className="space-y-2">
            <p>取引回数: {result.trades?.length || 0}回</p>
            <p>勝率: {formatPercent(result.winRate)}</p>
            <p>最大ドローダウン: {formatPercent(result.maxDrawdown)}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">リスク指標</h3>
          <div className="space-y-2">
            <p>シャープレシオ: {result.sharpeRatio?.toFixed(2) || '-'}</p>
          </div>
        </div>
      </div>

      {/* 株価チャート */}
      <div className="bg-slate-800 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">株価チャート</h3>
        <StockChart
          data={result.priceData}
          trades={result.trades}
          conditions={result.conditions || {
            buy: { operator: 'AND', conditions: [] },
            sell: { operator: 'AND', conditions: [] },
            tp: { operator: 'AND', conditions: [] },
            sl: { operator: 'AND', conditions: [] }
          }}
        />
      </div>

            {/* 資金推移チャート */}
      <div className="bg-slate-800 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">資金推移</h3>
        <Line
          options={chartOptions}
          data={{
            labels: result.dates,
            datasets: [
              {
                label: '口座残高',
                data: result.equity,
                borderColor: 'rgb(99, 102, 241)',
                tension: 0.1,
              },
            ],
          }}
        />
      </div>

      {/* インジケーター設定 */}
      <div className="bg-slate-800 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">インジケーター設定</h3>
        {result.conditions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 買い条件 */}
            <div className="border-r border-slate-700 pr-4">
              <h4 className="text-md font-medium mb-4">買い条件</h4>
              {result.conditions.buy && result.conditions.buy.conditions.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 mb-2">
                    条件の組み合わせ: {result.conditions.buy.operator === 'AND' ?
                      'すべての条件を満たす (AND)' :
                      'いずれかの条件を満たす (OR)'}
                  </p>
                  <div className="pl-4 border-l-2 border-indigo-500">
                    {result.conditions.buy.conditions.map((condition, index) => {
                      const indicator = indicators.find(i => i.id === condition.indicator);
                      if (!indicator) return null;

                      return (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">条件 {index + 1}</span>
                            <h5 className="text-slate-200">{indicator.name}</h5>
                          </div>
                          <div className="mt-1 pl-4 border-l border-slate-700">
                            <p className="text-sm text-slate-400">期間: {condition.period}</p>
                            {condition.params && Object.entries(condition.params).map(([key, value]) => (
                              <p key={key} className="text-sm text-slate-400">
                                {key}: {value}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">買い条件が設定されていません</p>
              )}

              {/* 利確条件 */}
              {result.conditions.tp?.conditions.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2 text-slate-400">利確条件</h5>
                  <div className="space-y-2">
                    {result.conditions.tp.conditions.map((condition, index) => {
                      const indicator = indicators.find(i => i.id === condition.indicator);
                      if (!indicator) return null;

                      return (
                        <div key={index} className="pl-4 border-l-2 border-slate-700">
                          <p className="text-slate-200">{indicator.name}</p>
                          <p className="text-sm text-slate-400">期間: {condition.period}</p>
                          {condition.params && Object.entries(condition.params).map(([key, value]) => (
                            <p key={key} className="text-sm text-slate-400">
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 売り条件 */}
            <div className="pl-4">
              <h4 className="text-md font-medium mb-4">売り条件</h4>
              {result.conditions.sell && result.conditions.sell.conditions.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 mb-2">
                    条件の組み合わせ: {result.conditions.sell.operator === 'AND' ?
                      'すべての条件を満たす (AND)' :
                      'いずれかの条件を満たす (OR)'}
                  </p>
                  <div className="pl-4 border-l-2 border-rose-500">
                    {result.conditions.sell.conditions.map((condition, index) => {
                      const indicator = indicators.find(i => i.id === condition.indicator);
                      if (!indicator) return null;

                      return (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">条件 {index + 1}</span>
                            <h5 className="text-slate-200">{indicator.name}</h5>
                          </div>
                          <div className="mt-1 pl-4 border-l border-slate-700">
                            <p className="text-sm text-slate-400">期間: {condition.period}</p>
                            {condition.params && Object.entries(condition.params).map(([key, value]) => (
                              <p key={key} className="text-sm text-slate-400">
                                {key}: {value}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400">売り条件が設定されていません</p>
              )}

              {/* 損切り条件 */}
              {result.conditions.sl?.conditions.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2 text-slate-400">損切り条件</h5>
                  <div className="space-y-2">
                    {result.conditions.sl.conditions.map((condition, index) => {
                      const indicator = indicators.find(i => i.id === condition.indicator);
                      if (!indicator) return null;

                      return (
                        <div key={index} className="pl-4 border-l-2 border-slate-700">
                          <p className="text-slate-200">{indicator.name}</p>
                          <p className="text-sm text-slate-400">期間: {condition.period}</p>
                          {condition.params && Object.entries(condition.params).map(([key, value]) => (
                            <p key={key} className="text-sm text-slate-400">
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">インジケーター設定はありません</p>
        )}
      </div>

      {/* トレード履歴 */}
      <div className="bg-slate-800 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">トレード履歴</h3>
        <TradeHistoryTable trades={result.trades} />
      </div>

    </div>
  );
}
