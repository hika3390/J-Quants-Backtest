import { NextRequest } from 'next/server';
import { DIContainer } from '../../../../src/utils/di-container';

export async function POST(request: NextRequest) {
  const controller = DIContainer.getBacktestController();
  return await controller.executeBacktest(request);
}
