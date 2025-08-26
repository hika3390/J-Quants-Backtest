import { BacktestEngine } from '../../app/lib/backtest/engine';
import { BacktestRequest, BacktestResult, BacktestEngineParams } from '../types/backtest';
import { IBacktestResultRepository, CreateBacktestResultData } from '../interfaces/backtest-result-repository.interface';
import { IBacktestService } from '../interfaces/backtest-service.interface';
import { DailyQuote } from '../utils/jquants-types';

export class BacktestService implements IBacktestService {
  constructor(private backtestResultRepository: IBacktestResultRepository) {}

  async executeBacktest(request: BacktestRequest, userId: string): Promise<BacktestResult> {
    // リクエストの妥当性検証
    this.validateBacktestRequest(request);

    // バックテストエンジンパラメータの構築
    const engineParams: BacktestEngineParams = {
      initialCash: request.initialCash,
      maxPosition: request.maxPosition,
      buyConditions: request.conditions.buy,
      sellConditions: request.conditions.sell,
      tpConditions: request.conditions.tp,
      slConditions: request.conditions.sl,
    };

    // バックテストエンジンを初期化して実行
    const engine = new BacktestEngine(request.priceData, engineParams);
    const engineResult = engine.run();

    // 指定された期間のデータをフィルタリング
    const filteredPriceData = this.filterPriceDataByDateRange(
      request.priceData,
      request.startDate,
      request.endDate
    );

    // データベースに保存するためのデータを準備
    const createData: CreateBacktestResultData = {
      userId,
      code: request.code,
      startDate: request.startDate,
      endDate: request.endDate,
      initialCash: request.initialCash,
      maxPosition: request.maxPosition,
      finalEquity: engineResult.finalEquity,
      totalReturn: engineResult.totalReturn,
      winRate: engineResult.winRate,
      maxDrawdown: engineResult.maxDrawdown,
      sharpeRatio: engineResult.sharpeRatio,
      priceData: JSON.parse(JSON.stringify(filteredPriceData)),
      equity: JSON.parse(JSON.stringify(engineResult.equity)),
      dates: JSON.parse(JSON.stringify(filteredPriceData.map(d => d.Date))),
      trades: JSON.parse(JSON.stringify(engineResult.trades)),
      conditions: JSON.parse(JSON.stringify(request.conditions)),
    };

    // データベースに保存
    const savedResult = await this.backtestResultRepository.create(createData);

    return savedResult;
  }

  async getBacktestById(id: string, userId: string): Promise<BacktestResult | null> {
    return await this.backtestResultRepository.findById(id, userId);
  }

  async getBacktestsByUser(userId: string): Promise<any[]> {
    return await this.backtestResultRepository.findByUserId(userId);
  }

  async deleteBacktest(id: string, userId: string): Promise<void> {
    await this.backtestResultRepository.delete(id, userId);
  }

  private validateBacktestRequest(request: BacktestRequest): void {
    if (!request.priceData || request.priceData.length === 0) {
      throw new Error('株価データが必要です');
    }

    const { buy, sell, tp, sl } = request.conditions;

    if (!buy?.conditions.length ||
        !sell?.conditions.length ||
        !tp?.conditions.length ||
        !sl?.conditions.length) {
      throw new Error('すべての取引条件を設定してください');
    }

    if (!request.code || !request.startDate || !request.endDate) {
      throw new Error('銘柄コード、開始日、終了日は必須です');
    }

    if (request.initialCash <= 0) {
      throw new Error('初期資金は0より大きい値を設定してください');
    }

    if (request.maxPosition <= 0 || request.maxPosition > 100) {
      throw new Error('最大ポジションは1-100%の範囲で設定してください');
    }
  }

  private filterPriceDataByDateRange(
    priceData: DailyQuote[],
    startDate: string,
    endDate: string
  ): DailyQuote[] {
    return priceData.filter(d => {
      const date = new Date(d.Date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  }
}
