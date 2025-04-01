import { NextRequest, NextResponse } from 'next/server';

import { BacktestResult } from '@/app/types/backtest';

declare global {
  var tempDataStore: Map<string, BacktestResult>;
}

// メモリ上での一時的なデータストア
if (!global.tempDataStore) {
  global.tempDataStore = new Map<string, BacktestResult>();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = new Date().getTime().toString();
    
    // バックテスト結果にIDを追加して保存
    const resultWithId = {
      ...data,
      id
    };
    
    // データを一時的に保存
    global.tempDataStore.set(id, resultWithId);

    // 30分後にデータを削除
    setTimeout(() => {
      tempDataStore.delete(id);
    }, 30 * 60 * 1000);

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to store data : ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    );
  }

  const data = tempDataStore.get(id);
  
  if (!data) {
    return NextResponse.json(
      { error: 'Data not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}
