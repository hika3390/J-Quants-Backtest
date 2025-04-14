import { NextRequest, NextResponse } from 'next/server';
import { BacktestEngine } from '@/app/lib/backtest/engine';
import { DailyQuote } from '@/app/lib/jquants/api';
import { TabType, ConditionGroup } from '@/app/types/backtest';

interface BacktestRequest {
  code: string;
  startDate: string;
  endDate: string;
  initialCash: number;
  maxPosition: number;
  conditions: Record<TabType, ConditionGroup>;
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

    // トレード条件を検証
    const { 
      buy: buyConditions, 
      sell: sellConditions,
      tp: tpConditions,
      sl: slConditions 
    } = conditions;
    console.log('Trading conditions:', { buyConditions, sellConditions, tpConditions, slConditions }); // デバッグログ

    if (!buyConditions?.conditions.length || 
        !sellConditions?.conditions.length ||
        !tpConditions?.conditions.length ||
        !slConditions?.conditions.length) {
      return NextResponse.json(
        { error: 'すべての取引条件を設定してください' },
        { status: 400 }
      );
    }

    // エンジンパラメータを構築
    const engineParams = {
      initialCash: Number(initialCash),
      maxPosition: Number(maxPosition),
      buyConditions,
      sellConditions,
      tpConditions,
      slConditions
    };

    console.log('Engine parameters:', engineParams); // デバッグログ

    // バックテストエンジンを初期化して実行
    const engine = new BacktestEngine(priceData, engineParams);

    // バックテストを実行
    const result = engine.run();

    // バックテスト結果に追加情報を含める
    // 指定された期間のデータを確実に含める
    const filteredPriceData = body.priceData.filter(d => {
      const date = new Date(d.Date);
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      return date >= start && date <= end;
    });

    const response = {
      ...result,
      code: body.code,
      startDate: body.startDate,
      endDate: body.endDate,
      executedAt: new Date().toISOString(),
      priceData: filteredPriceData,
      dates: filteredPriceData.map(d => d.Date),
      conditions: {
        buy: buyConditions,
        sell: sellConditions,
        tp: tpConditions,
        sl: slConditions
      }
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
