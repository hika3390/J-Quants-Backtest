/**
 * 単純移動平均（SMA）を計算する
 * @param prices 価格の配列
 * @param period 期間
 * @returns 移動平均値の配列
 */
export const calculateMA = (prices: number[], period: number): number[] => {
  const ma: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      ma.push(NaN);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    ma.push(sum / period);
  }

  return ma;
};

/**
 * 指数移動平均（EMA）を計算する
 * @param prices 価格の配列
 * @param period 期間
 * @returns 指数移動平均値の配列
 */
export const calculateEMA = (prices: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  // 最初のEMAは単純移動平均として計算
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema[period - 1] = sum / period;

  // それ以降のEMAを計算
  for (let i = period; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }

  // 期間未満の部分をNaNで埋める
  for (let i = 0; i < period - 1; i++) {
    ema[i] = NaN;
  }

  return ema;
};
