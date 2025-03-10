/**
 * RSI（相対力指数）の計算を行うユーティリティ関数
 */

import { DailyQuote } from '../jquants/api';

/**
 * 価格の変化量を計算
 */
function calculatePriceChanges(prices: number[]): number[] {
  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  return changes;
}

/**
 * RSIの計算
 * @param quotes - 日足データの配列
 * @param period - RSIの期間（デフォルト14日）
 * @returns RSIの配列
 */
export function calculateRSI(quotes: DailyQuote[], period: number = 14): number[] {
  const closePrices = quotes.map(quote => quote.Close);
  const priceChanges = calculatePriceChanges(closePrices);
  const rsiValues: number[] = [];

  // 最初のperiod日分はRSIを計算できないのでnullで埋める
  for (let i = 0; i < period; i++) {
    rsiValues.push(0);
  }

  for (let i = period; i < quotes.length; i++) {
    let gains = 0;
    let losses = 0;

    // 過去period日間の値動きを計算
    for (let j = i - period; j < i; j++) {
      const change = priceChanges[j];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    // 平均上昇幅と平均下落幅を計算
    const averageGain = gains / period;
    const averageLoss = losses / period;

    // RSIの計算
    const rs = averageGain / averageLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }

  return rsiValues;
}

/**
 * RSIに基づいて売買シグナルを生成
 * @param rsiValues - RSIの配列
 * @param overboughtThreshold - 買われ過ぎのしきい値（デフォルト70）
 * @param oversoldThreshold - 売られ過ぎのしきい値（デフォルト30）
 * @returns 売買シグナルの配列（1: 買い、-1: 売り、0: シグナルなし）
 */
export function generateRSISignals(
  rsiValues: number[],
  overboughtThreshold: number = 70,
  oversoldThreshold: number = 30
): number[] {
  return rsiValues.map(rsi => {
    if (rsi <= oversoldThreshold) {
      return 1; // 買いシグナル
    } else if (rsi >= overboughtThreshold) {
      return -1; // 売りシグナル
    }
    return 0; // シグナルなし
  });
}
