import { DailyQuote } from '../jquants/api';
import { calculateRSI, generateRSISignals } from '../indicators/rsi';
import { calculateMA, calculateEMA } from '../indicators/ma';

interface BacktestParameters {
  initialCash: number;
  maxPosition: number;
  indicator: string;
  period: number;
  params: Record<string, number | string>;
}

interface MASignalParams {
  type: 'SMA' | 'EMA';
  period: number;
}

function generateMASignals(prices: number[], params: MASignalParams): number[] {
  const signals: number[] = [];
  const maValues = params.type === 'SMA' 
    ? calculateMA(prices, params.period)
    : calculateEMA(prices, params.period);

  // 最初のperiod日分はシグナルなし
  for (let i = 0; i < params.period; i++) {
    signals.push(0);
  }

  // 価格がMAを上回ったら買い、下回ったら売り
  for (let i = params.period; i < prices.length; i++) {
    if (prices[i] > maValues[i]) {
      signals.push(1);  // 買いシグナル
    } else if (prices[i] < maValues[i]) {
      signals.push(-1); // 売りシグナル
    } else {
      signals.push(0);  // シグナルなし
    }
  }

  return signals;
}

interface Position {
  entryPrice: number;
  quantity: number;
  entryDate: string;
}

export interface Trade {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  returnPercent: number;
}

export interface BacktestResult {
  initialCash: number;
  trades: Trade[];
  equity: number[];
  dates: string[];
  finalEquity: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

/**
 * バックテストエンジン
 */
export class BacktestEngine {
  private quotes: DailyQuote[];
  private params: BacktestParameters;
  private position: Position | null = null;
  private cash: number;
  private trades: Trade[] = [];
  private equity: number[] = [];
  private dates: string[] = [];

  constructor(quotes: DailyQuote[], params: BacktestParameters) {
    this.quotes = quotes;
    this.params = params;
    this.cash = params.initialCash;
  }

  /**
   * バックテストを実行
   */
  public run(): BacktestResult {
    // 価格データを配列に変換
    const prices = this.quotes.map(q => q.Close);
    let signals: number[];

    // 価格データを取得
    const priceArray = this.quotes.map(q => {
      return {
        open: q.Open,
        close: q.Close
      };
    });

    // インジケーターに応じてシグナルを生成
    switch (this.params.indicator) {
      case 'price': {
        const priceType = this.params.params.priceType as 'open' | 'close';
        const operator = this.params.params.operator as string;
        const targetValue = Number(this.params.params.targetValue);
        signals = priceArray.map(p => {
          const currentPrice = priceType === 'open' ? p.open : p.close;
          switch (operator) {
            case '>':
              return currentPrice > targetValue ? 1 : -1;
            case '<':
              return currentPrice < targetValue ? 1 : -1;
            case '>=':
              return currentPrice >= targetValue ? 1 : -1;
            case '<=':
              return currentPrice <= targetValue ? 1 : -1;
            case '==':
              return currentPrice === targetValue ? 1 : -1;
            default:
              return 0;
          }
        });
        break;
      }
      case 'rsi': {
        const rsiValues = calculateRSI(this.quotes, this.params.period);
        signals = generateRSISignals(
          rsiValues,
          this.params.params.overboughtThreshold as number,
          this.params.params.oversoldThreshold as number
        );
        break;
      }
      case 'ma': {
        signals = generateMASignals(prices, {
          type: this.params.params.type as 'SMA' | 'EMA',
          period: this.params.period
        });
        break;
      }
      default:
        throw new Error(`未対応のインジケーター: ${this.params.indicator}`);
    }

    // 各日の価格でシミュレーション
    for (let i = 0; i < this.quotes.length; i++) {
      const quote = this.quotes[i];
      const signal = signals[i];

      this.processSignal(signal, quote);
      this.updateEquity(quote);
      this.dates.push(quote.Date);
    }

    // ポジションが残っている場合は最終日で決済
    if (this.position) {
      const lastQuote = this.quotes[this.quotes.length - 1];
      this.closePosition(lastQuote);
    }

    return this.calculateResults();
  }

  /**
   * シグナルに基づいて売買を実行
   */
  private processSignal(signal: number, quote: DailyQuote) {
    if (signal === 1 && !this.position) {
      // 買いシグナルかつポジションがない場合は新規購入
      const maxQuantity = Math.floor((this.params.initialCash * this.params.maxPosition / 100) / quote.Close);
      const quantity = Math.min(Math.floor(this.cash / quote.Close), maxQuantity);
      if (quantity > 0) {
        this.position = {
          entryPrice: quote.Close,
          quantity,
          entryDate: quote.Date
        };
        this.cash -= quantity * quote.Close;
      }
    } else if (signal === -1 && this.position) {
      // 売りシグナルかつポジションがある場合は決済
      this.closePosition(quote);
    }
  }

  /**
   * ポジションを決済
   */
  private closePosition(quote: DailyQuote) {
    if (!this.position) return;

    const profitLoss = (quote.Close - this.position.entryPrice) * this.position.quantity;
    const returnPercent = ((quote.Close - this.position.entryPrice) / this.position.entryPrice) * 100;

    this.trades.push({
      entryDate: this.position.entryDate,
      exitDate: quote.Date,
      entryPrice: this.position.entryPrice,
      exitPrice: quote.Close,
      quantity: this.position.quantity,
      profitLoss,
      returnPercent
    });

    this.cash += quote.Close * this.position.quantity;
    this.position = null;
  }

  /**
   * 各日の純資産を計算
   */
  private updateEquity(quote: DailyQuote) {
    let currentEquity = this.cash;
    if (this.position) {
      currentEquity += this.position.quantity * quote.Close;
    }
    this.equity.push(currentEquity);
  }

  /**
   * バックテスト結果を計算
   */
  private calculateResults(): BacktestResult {
    const finalEquity = this.equity[this.equity.length - 1];
    const totalReturn = ((finalEquity - this.params.initialCash) / this.params.initialCash) * 100;

    // 勝率を計算
    const winningTrades = this.trades.filter(trade => trade.profitLoss > 0);
    const winRate = (winningTrades.length / this.trades.length) * 100;

    // 最大ドローダウンを計算
    let maxDrawdown = 0;
    let peak = -Infinity;
    for (const equity of this.equity) {
      if (equity > peak) {
        peak = equity;
      }
      const drawdown = ((peak - equity) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // シャープレシオを計算（年率）
    const dailyReturns = this.equity.map((equity, i) => 
      i === 0 ? 0 : (equity - this.equity[i - 1]) / this.equity[i - 1]
    );
    const averageReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    const stdDev = Math.sqrt(
      dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / dailyReturns.length
    );
    const annualizedSharpe = (averageReturn * 252) / (stdDev * Math.sqrt(252));

    return {
      initialCash: this.params.initialCash,
      trades: this.trades,
      equity: this.equity,
      dates: this.dates,
      finalEquity,
      totalReturn,
      winRate,
      maxDrawdown,
      sharpeRatio: annualizedSharpe
    };
  }
}
