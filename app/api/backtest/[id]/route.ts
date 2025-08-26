import { NextRequest } from 'next/server';
import { DIContainer } from '../../../../src/utils/di-container';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const controller = DIContainer.getBacktestController();
  const { id } = await params;
  return await controller.getBacktestById(request, { id });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const controller = DIContainer.getBacktestController();
  const { id } = await params;
  return await controller.deleteBacktest(request, { id });
}
