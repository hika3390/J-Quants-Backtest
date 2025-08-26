import { NextRequest, NextResponse } from 'next/server';

export interface IBacktestController {
  executeBacktest(request: NextRequest): Promise<NextResponse>;
  getBacktestList(request: NextRequest): Promise<NextResponse>;
  getBacktestById(request: NextRequest, params: { id: string }): Promise<NextResponse>;
  storeBacktest(request: NextRequest): Promise<NextResponse>;
  deleteBacktest(request: NextRequest, params: { id: string }): Promise<NextResponse>;
}
