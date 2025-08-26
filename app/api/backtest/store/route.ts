import { NextRequest } from 'next/server';
import { DIContainer } from '../../../../src/utils/di-container';

export async function POST(request: NextRequest) {
  const controller = DIContainer.getBacktestController();
  return await controller.storeBacktest(request);
}

export async function GET(request: NextRequest) {
  const controller = DIContainer.getBacktestController();
  return await controller.storeBacktest(request);
}
