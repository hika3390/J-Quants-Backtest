import { NextRequest } from 'next/server';
import { DIContainer } from '../../../../src/utils/di-container';

export async function GET(request: NextRequest) {
  const controller = DIContainer.getBacktestController();
  return await controller.getBacktestList(request);
}
