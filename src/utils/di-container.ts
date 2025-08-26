import { BacktestResultRepository } from '../repositories/backtest-result.repository';
import { BacktestService } from '../services/backtest.service';
import { BacktestController } from '../controllers/backtest.controller';
import { IBacktestResultRepository } from '../interfaces/backtest-result-repository.interface';
import { IBacktestService } from '../interfaces/backtest-service.interface';
import { prisma } from '../../app/lib/prisma';

// 既存のPrismaインスタンスを使用
export function getPrismaClient() {
  return prisma;
}

// DIコンテナ
export class DIContainer {
  private static backtestResultRepository: IBacktestResultRepository | null = null;
  private static backtestService: IBacktestService | null = null;
  private static backtestController: BacktestController | null = null;

  static getBacktestResultRepository(): IBacktestResultRepository {
    if (!this.backtestResultRepository) {
      const prisma = getPrismaClient();
      this.backtestResultRepository = new BacktestResultRepository(prisma);
    }
    return this.backtestResultRepository;
  }

  static getBacktestService(): IBacktestService {
    if (!this.backtestService) {
      const repository = this.getBacktestResultRepository();
      this.backtestService = new BacktestService(repository);
    }
    return this.backtestService;
  }

  static getBacktestController(): BacktestController {
    if (!this.backtestController) {
      const service = this.getBacktestService();
      this.backtestController = new BacktestController(service);
    }
    return this.backtestController;
  }

  // テスト用のクリーンアップ
  static reset(): void {
    this.backtestResultRepository = null;
    this.backtestService = null;
    this.backtestController = null;
  }
}
