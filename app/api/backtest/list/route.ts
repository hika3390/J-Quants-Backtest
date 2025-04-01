import { NextResponse } from 'next/server';
import { BacktestResult } from '@/app/types/backtest';

declare global {
  var tempDataStore: Map<string, BacktestResult>;
}

// メモリ上の一時データストアからバックテスト結果の一覧を取得
export async function GET() {
  try {
    if (!global.tempDataStore) {
      return NextResponse.json([]);
    }

    const results: BacktestResult[] = Array.from(global.tempDataStore.entries()).map(
      ([id, data]) => ({
        ...data,
        id
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch backtest results:', error);
    return NextResponse.json(
      { error: 'バックテスト結果の取得に失敗しました' },
      { status: 500 }
    );
  }
}
