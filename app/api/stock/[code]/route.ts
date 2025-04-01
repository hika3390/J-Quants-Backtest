import { NextRequest, NextResponse } from 'next/server';
import JQuantsApi from '@/app/lib/jquants/api';

export async function GET(
  request: NextRequest,
  {params}: { params: Promise<{code: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const { code } = await params;

    // パラメータのバリデーション
    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to parameters are required' },
        { status: 400 }
      );
    }

    const api = JQuantsApi.getInstance();

    // 証券コードの存在確認
    const isValidCode = await api.validateStockCode(code);
    if (!isValidCode) {
      return NextResponse.json(
        { error: 'Invalid stock code' },
        { status: 400 }
      );
    }

    // 株価データの取得
    const dailyQuotes = await api.getDailyQuotes(code, from, to);

    return NextResponse.json({ data: dailyQuotes });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch stock data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
