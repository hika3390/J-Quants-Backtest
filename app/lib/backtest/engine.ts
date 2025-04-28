import { DailyQuote } from '../jquants/api';
import { calculateRSI, generateRSISignals } from '../indicators/rsi';
import { calculateMA, calculateEMA } from '../indicators/ma';
import { Condition, ConditionGroup } from '@/app/types/backtest';

/**
 * 時間参照に基づいてインデックスを計算
 */
function calculateTimeReferenceIndex(currentIndex: number, timeReference: string, period: number, quotes: DailyQuote[]): number {
  if (!timeReference || timeReference === 'current' || period === 0) {
    return currentIndex;
  }

  const currentDate = new Date(quotes[currentIndex].Date);
  
  switch (timeReference) {
    case 'days':
      // 単純に日数を引く
      const targetIndex = currentIndex - period;
      return targetIndex >= 0 ? targetIndex : 0;
      
    case 'weeks':
      // 週数 * 7日を引く
      const weeksIndex = currentIndex - (period * 7);
      return weeksIndex >= 0 ? weeksIndex : 0;
      
    case 'months': {
      // 月を引く
      const targetDate = new Date(currentDate);
      targetDate.setMonth(targetDate.getMonth() - period);
      
      // 日付に最も近いインデックスを探す
      return findClosestDateIndex(targetDate, quotes, currentIndex);
    }
      
    case 'quarters': {
      // 四半期（3ヶ月）を引く
      const targetDate = new Date(currentDate);
      targetDate.setMonth(targetDate.getMonth() - (period * 3));
      
      return findClosestDateIndex(targetDate, quotes, currentIndex);
    }
      
    case 'years': {
      // 年を引く
      const targetDate = new Date(currentDate);
      targetDate.setFullYear(targetDate.getFullYear() - period);
      
      return findClosestDateIndex(targetDate, quotes, currentIndex);
    }
      
    default:
      return currentIndex;
  }
}

/**
 * 指定した日付に最も近いインデックスを見つける
 */
function findClosestDateIndex(targetDate: Date, quotes: DailyQuote[], currentIndex: number): number {
  // 現在のインデックスから遡って探す
  for (let i = currentIndex; i >= 0; i--) {
    const quoteDate = new Date(quotes[i].Date);
    if (quoteDate <= targetDate) {
      return i;
    }
  }
  
  return 0; // 見つからない場合は最初のデータを返す
}

interface BacktestParameters {
  initialCash: number;
  maxPosition: number;
  buyConditions: ConditionGroup;
  sellConditions: ConditionGroup;
  tpConditions: ConditionGroup;  // 利確条件
  slConditions: ConditionGroup;  // 損切り条件
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
  exitReason: 'sell' | 'stop_loss' | 'take_profit';
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
   * 指定されたインデックスの価格データを取得
   */
  private getQuoteValue(quote: DailyQuote, priceType: string): number {
    switch (priceType) {
      case 'open': return quote.Open;
      case 'close': return quote.Close;
      case 'high': return quote.High;
      case 'low': return quote.Low;
      case 'adjustmentClose': return quote.AdjustmentClose || quote.Close;
      case 'vwap': return quote.VWAP || quote.Close;
      default: return quote.Close;
    }
  }

  /**
   * 時間参照を考慮して価格データを取得
   */
  private getTimeReferenceValue(
    currentIndex: number, 
    priceType: string, 
    timeReference: string, 
    period: number
  ): number {
    if (!timeReference || timeReference === 'current' || period === 0) {
      return this.getQuoteValue(this.quotes[currentIndex], priceType);
    }
    
    const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, period, this.quotes);
    return this.getQuoteValue(this.quotes[refIndex], priceType);
  }

  /**
   * 比較演算子に基づいて条件を評価
   */
  private evaluateComparison(value1: number, operator: string, value2: number): boolean {
    switch (operator) {
      case '>': return value1 > value2;
      case '<': return value1 < value2;
      case '>=': return value1 >= value2;
      case '<=': return value1 <= value2;
      case '==': return value1 === value2;
      case '!=': return value1 !== value2;
      default: return false;
    }
  }

  /**
   * 単一条件のシグナルを生成
   */
  private generateSignalForCondition(condition: Condition, quote: DailyQuote, prices: number[]): number {
    const currentIndex = this.quotes.findIndex(q => q.Date === quote.Date);
    if (currentIndex === -1) return 0;

    switch (condition.indicator) {
      case 'price': {
        const priceType = condition.params.priceType as string;
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const currentPrice = this.getTimeReferenceValue(currentIndex, priceType, timeReference, refPeriod);
        
        return this.evaluateComparison(currentPrice, operator, targetValue) ? 1 : -1;
      }
      
      case 'price_comparison': {
        const priceType1 = condition.params.priceType1 as string;
        const timeRef1 = condition.params.timeReference1 as string;
        const refPeriod1 = Number(condition.params.refPeriod1 || 0);
        
        const priceType2 = condition.params.priceType2 as string;
        const timeRef2 = condition.params.timeReference2 as string;
        const refPeriod2 = Number(condition.params.refPeriod2 || 0);
        
        const operator = condition.params.operator as string;
        
        const value1 = this.getTimeReferenceValue(currentIndex, priceType1, timeRef1, refPeriod1);
        const value2 = this.getTimeReferenceValue(currentIndex, priceType2, timeRef2, refPeriod2);
        
        return this.evaluateComparison(value1, operator, value2) ? 1 : -1;
      }
      case 'profit_loss_percent': {
        if (!this.position) return -1;
        const operator = condition.params.operator as string;
        
        // 「無効」オプションの場合は常に-1を返す（シグナルなし）
        if (operator === 'disabled') {
          return -1;
        }
        
        const targetValue = Number(condition.params.targetValue);
        const currentPnL = ((quote.Close - this.position.entryPrice) / this.position.entryPrice) * 100;

        return this.evaluateComparison(currentPnL, operator, targetValue) ? 1 : -1;
      }
      case 'profit_loss_amount': {
        if (!this.position) return -1;
        const operator = condition.params.operator as string;
        
        // 「無効」オプションの場合は常に-1を返す（シグナルなし）
        if (operator === 'disabled') {
          return -1;
        }
        
        const targetValue = Number(condition.params.targetValue);
        const currentPnL = (quote.Close - this.position.entryPrice) * this.position.quantity;

        return this.evaluateComparison(currentPnL, operator, targetValue) ? 1 : -1;
      }
      case 'volume': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const volume = this.quotes[refIndex].Volume;
        
        return this.evaluateComparison(volume, operator, targetValue) ? 1 : -1;
      }
      
      case 'turnover_value': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const turnoverValue = this.quotes[refIndex].TurnoverValue || 0;
        
        return this.evaluateComparison(turnoverValue, operator, targetValue) ? 1 : -1;
      }
      
      case 'market_cap': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const marketCap = this.quotes[refIndex].MarketCapitalization || 0;
        
        return this.evaluateComparison(marketCap, operator, targetValue) ? 1 : -1;
      }
      
      // ファンダメンタル指標
      case 'per': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const per = this.quotes[refIndex].PER || 0;
        
        return this.evaluateComparison(per, operator, targetValue) ? 1 : -1;
      }
      
      case 'pbr': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const pbr = this.quotes[refIndex].PBR || 0;
        
        return this.evaluateComparison(pbr, operator, targetValue) ? 1 : -1;
      }
      
      case 'dividend_yield': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const dividendYield = this.quotes[refIndex].DividendYield || 0;
        
        return this.evaluateComparison(dividendYield, operator, targetValue) ? 1 : -1;
      }
      
      case 'roe': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const roe = this.quotes[refIndex].ROE || 0;
        
        return this.evaluateComparison(roe, operator, targetValue) ? 1 : -1;
      }
      
      case 'roa': {
        const timeReference = condition.params.timeReference as string;
        const refPeriod = Number(condition.params.refPeriod || 0);
        const operator = condition.params.operator as string;
        const targetValue = Number(condition.params.targetValue);
        
        const refIndex = calculateTimeReferenceIndex(currentIndex, timeReference, refPeriod, this.quotes);
        const roa = this.quotes[refIndex].ROA || 0;
        
        return this.evaluateComparison(roa, operator, targetValue) ? 1 : -1;
      }
      
      // 企業・市場情報
      case 'market': {
        const operator = condition.params.operator as string;
        const targetValue = condition.params.targetValue as string;
        const market = quote.Market || '';
        
        return (operator === '==' && market === targetValue) || 
               (operator === '!=' && market !== targetValue) ? 1 : -1;
      }
      
      case 'industry': {
        const operator = condition.params.operator as string;
        const targetValue = condition.params.targetValue as string;
        const industry = quote.Industry || '';
        
        return (operator === '==' && industry === targetValue) || 
               (operator === '!=' && industry !== targetValue) ? 1 : -1;
      }
      
      case 'sector': {
        const operator = condition.params.operator as string;
        const targetValue = condition.params.targetValue as string;
        const sector = quote.Sector || '';
        
        return (operator === '==' && sector === targetValue) || 
               (operator === '!=' && sector !== targetValue) ? 1 : -1;
      }
      
      // テクニカル指標
      case 'rsi': {
        const rsiValues = calculateRSI([quote], condition.period);
        return generateRSISignals(
          rsiValues,
          condition.params.overboughtThreshold as number,
          condition.params.oversoldThreshold as number
        )[0];
      }
      case 'ma': {
        const priceType = condition.params.priceType as string || 'close';
        const maType = condition.params.type as 'SMA' | 'EMA';
        const operator = condition.params.operator as string;
        const compareTarget = condition.params.compareTarget as string || 'price';
        const comparePeriod = Number(condition.params.comparePeriod || 5);
        
        // 価格データを取得
        const priceData = this.quotes.slice(0, currentIndex + 1).map(q => this.getQuoteValue(q, priceType));
        
        // MAを計算
        const maValues = maType === 'SMA' 
          ? calculateMA(priceData, condition.period)
          : calculateEMA(priceData, condition.period);
        
        if (maValues.length === 0) return 0;
        
        const currentMA = maValues[maValues.length - 1];
        
        if (compareTarget === 'price') {
          // 現在の価格とMAを比較
          const currentPrice = this.getQuoteValue(quote, priceType);
          return this.evaluateComparison(currentPrice, operator, currentMA) ? 1 : -1;
        } else {
          // 別のMAと比較
          const compareMA = maType === 'SMA'
            ? calculateMA(priceData, comparePeriod)
            : calculateEMA(priceData, comparePeriod);
            
          if (compareMA.length === 0) return 0;
          
          const compareValue = compareMA[compareMA.length - 1];
          return this.evaluateComparison(currentMA, operator, compareValue) ? 1 : -1;
        }
      }
      case 'bollinger': {
        const stdDev = Number(condition.params.stdDev || 2);
        const priceType = condition.params.priceType as string || 'close';
        
        // 価格データを取得
        const priceData = this.quotes.slice(0, currentIndex + 1).map(q => this.getQuoteValue(q, priceType));
        
        // 移動平均を計算
        const ma = calculateMA(priceData.slice(-condition.period), condition.period);
        if (ma.length === 0) return 0;
        
        const currentMA = ma[ma.length - 1];
        
        // 標準偏差を計算
        const recentPrices = priceData.slice(-condition.period);
        const sum = recentPrices.reduce((a, b) => a + b, 0);
        const avg = sum / recentPrices.length;
        const squareDiffs = recentPrices.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
        const sd = Math.sqrt(avgSquareDiff);
        
        // バンドを計算
        const upperBand = currentMA + (sd * stdDev);
        const lowerBand = currentMA - (sd * stdDev);
        
        // 現在の価格
        const currentPrice = this.getQuoteValue(quote, priceType);
        
        // 価格がバンドを超えているかチェック
        if (currentPrice > upperBand) {
          return -1; // 売りシグナル（上限超え）
        } else if (currentPrice < lowerBand) {
          return 1;  // 買いシグナル（下限超え）
        } else {
          return 0;  // シグナルなし（バンド内）
        }
      }
      
      default:
        throw new Error(`未対応のインジケーター: ${condition.indicator}`);
    }
  }

  /**
   * 条件グループの評価
   */
  private evaluateConditionGroup(group: ConditionGroup, quote: DailyQuote, prices: number[]): boolean {
    const results = group.conditions.map(condition => 
      this.generateSignalForCondition(condition, quote, prices) === 1
    );

    return group.operator === 'AND'
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  /**
   * バックテストを実行
   */
  public run(): BacktestResult {
    const prices = this.quotes.map(q => q.Close);

    // 各日の価格でシミュレーション
    for (let i = 0; i < this.quotes.length; i++) {
      const quote = this.quotes[i];
      const priceHistory = prices.slice(0, i + 1);

      // ポジションがない場合は買いシグナルを評価
      if (!this.position) {
        const shouldBuy = this.evaluateConditionGroup(this.params.buyConditions, quote, priceHistory);

        if (shouldBuy) {
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
        }
      } 
      // ポジションがある場合は決済条件を評価
      else {
        // 1. 損切り条件を最優先で評価
        const shouldStopLoss = this.evaluateConditionGroup(this.params.slConditions, quote, priceHistory);
        if (shouldStopLoss) {
          this.closePosition(quote, 'stop_loss');
          continue;  // 次の日へ
        }

        // 2. 利確条件を評価
        const shouldTakeProfit = this.evaluateConditionGroup(this.params.tpConditions, quote, priceHistory);
        if (shouldTakeProfit) {
          this.closePosition(quote, 'take_profit');
          continue;  // 次の日へ
        }

        // 3. 一般的な売り条件を評価
        const shouldSell = this.evaluateConditionGroup(this.params.sellConditions, quote, priceHistory);
        if (shouldSell) {
          this.closePosition(quote, 'sell');
        }
      }

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
  private closePosition(quote: DailyQuote, reason: 'sell' | 'stop_loss' | 'take_profit' = 'sell') {
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
      returnPercent,
      exitReason: reason  // 決済理由を追加
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
