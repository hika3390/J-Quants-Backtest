import { NextRequest, NextResponse } from 'next/server';
import { BacktestEngine } from '@/app/lib/backtest/engine';
import { DailyQuote } from '@/app/lib/jquants/api';
import { TabType } from '@/app/types/backtest';

interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number>;
}

interface BacktestRequest {
  code: string;
  startDate: string;
  endDate: string;
  initialCash: number;
  maxPosition: number;
  conditions: Record<TabType, Condition | null>;
  priceData: DailyQuote[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BacktestRequest;
    const {
      initialCash,
      maxPosition,
      conditions,
      priceData
    } = body;

    console.log('Request body:', body); // デバッグログ

    // パラメータのバリデーション
    if (!priceData || priceData.length === 0) {
      return NextResponse.json(
        { error: '株価データが必要です' },
        { status: 400 }
      );
    }

    // RSIの条件を検証
    const { buy: buyCondition, sell: sellCondition } = conditions;
    console.log('Trading conditions:', { buyCondition, sellCondition }); // デバッグログ

    if (!buyCondition?.indicator || !sellCondition?.indicator) {
      return NextResponse.json(
        { error: 'RSIの買い条件と売り条件を設定してください' },
        { status: 400 }
      );
    }

    if (buyCondition.indicator !== 'rsi' || sellCondition.indicator !== 'rsi') {
      return NextResponse.json(
        { error: 'RSIインジケーターを選択してください' },
        { status: 400 }
      );
    }

    // RSIのパラメータを取得
    const engineParams = {
      initialCash: Number(initialCash),
      maxPosition: Number(maxPosition),
      rsiPeriod: buyCondition.period || 14,
      overboughtThreshold: sellCondition.params['標準偏差'] || 70,
      oversoldThreshold: buyCondition.params['標準偏差'] || 30
    };

    console.log('Engine parameters:', engineParams); // デバッグログ

    // バックテストエンジンを初期化して実行
    const engine = new BacktestEngine(priceData, engineParams);

    // バックテストを実行
    const result = engine.run();

    // バックテスト結果に追加情報を含める
    const response = {
      ...result,
      code: body.code,
      startDate: body.startDate,
      endDate: body.endDate,
      priceData: body.priceData,
      dates: body.priceData.map(d => d.Date),
      rsiPeriod: buyCondition.period
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Backtest error:', error);
    return NextResponse.json(
      { error: 'Failed to run backtest' },
      { status: 500 }
    );
  }
}
