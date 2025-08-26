export interface DailyQuote {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  AdjustmentClose?: number;  // 調整後終値
  VWAP?: number;             // 出来高加重平均価格
  TurnoverValue?: number;    // 売買代金
  SharesOutstanding?: number; // 発行済株式数
  MarketCapitalization?: number; // 時価総額

  // ファンダメンタル指標
  PER?: number;              // 株価収益率
  PBR?: number;              // 株価純資産倍率
  DividendYield?: number;    // 配当利回り
  EPS?: number;              // 1株あたり利益
  BPS?: number;              // 1株あたり純資産
  ROE?: number;              // 自己資本利益率
  ROA?: number;              // 総資産利益率
  EquityRatio?: number;      // 自己資本比率

  // 財務データ
  Revenue?: number;          // 売上高
  OperatingIncome?: number;  // 営業利益
  OrdinaryIncome?: number;   // 経常利益
  NetIncome?: number;        // 純利益
  TotalAssets?: number;      // 総資産
  NetAssets?: number;        // 純資産
  CashFlow?: number;         // キャッシュフロー

  // 企業・市場情報
  Code?: string;             // 証券コード
  Name?: string;             // 銘柄名
  Market?: string;           // 市場区分
  Industry?: string;         // 業種
  Sector?: string;           // セクター
}
