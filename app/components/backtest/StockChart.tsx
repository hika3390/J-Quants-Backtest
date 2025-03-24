import { DailyQuote } from '@/app/lib/jquants/api';
import { Trade } from '@/app/types/backtest';
import { calculateRSI } from '@/app/lib/indicators/rsi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Legend,
} from 'recharts';

import { Condition } from '@/app/types/backtest';

interface StockChartProps {
  data: DailyQuote[];
  trades?: Trade[];
  conditions?: {
    buy: Condition[];
    sell: Condition[];
    tp: Condition[];
    sl: Condition[];
  };
}

interface ChartData extends DailyQuote {
  rsi?: number;
  signal?: 'buy' | 'sell';
}

export default function StockChart({ data, trades = [], conditions }: StockChartProps) {
  // RSI設定を取得
  const rsiCondition = conditions?.buy?.find(c => c.indicator === 'rsi') ||
                      conditions?.sell?.find(c => c.indicator === 'rsi');
  const rsiPeriod = rsiCondition?.period || 14;
  
  // RSIを計算
  const rsiValues = calculateRSI(data, rsiPeriod);

  // チャートデータを生成
  const chartData: ChartData[] = data.map((quote, index) => {
    const trade = trades.find(t => 
      t.entryDate === quote.Date || t.exitDate === quote.Date
    );

    return {
      ...quote,
      rsi: rsiValues[index],
      signal: trade 
        ? (trade.entryDate === quote.Date ? 'buy' : 'sell')
        : undefined
    };
  });

  // カスタムマーカー
  const BuyMarker = (props: any) => (
    <path
      d={`M ${props.cx},${props.cy-8} L ${props.cx+8},${props.cy+4} L ${props.cx-8},${props.cy+4} Z`}
      fill="#34d399"
      strokeWidth={1}
    />
  );

  const SellMarker = (props: any) => (
    <g transform={`translate(${props.cx},${props.cy})`}>
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="#fb7185" strokeWidth="2"/>
      <line x1="-8" y1="8" x2="8" y2="-8" stroke="#fb7185" strokeWidth="2"/>
    </g>
  );

  return (
    <div className="w-full h-[600px] space-y-4">
      {/* 株価チャート */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                paddingBottom: "10px",
              }}
            />
            <XAxis
              dataKey="Date"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(date) => date.split('-').slice(1).join('/')}
            />
            <YAxis
              tick={{ fill: '#94a3b8' }}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '0.375rem',
              }}
              itemStyle={{ color: '#94a3b8' }}
              formatter={(value, name, props) => {
                if (props.payload.signal) {
                  const trade = trades.find(t => 
                    t.entryDate === props.payload.Date || 
                    t.exitDate === props.payload.Date
                  );
                  if (trade) {
                    const date = new Date(props.payload.Date).toLocaleDateString('ja-JP');
                    if (trade.entryDate === props.payload.Date) {
                      return [`買いエントリー価格: ¥${value.toLocaleString()}`, `日付: ${date}`];
                    } else {
                      return [
                        `売り決済価格: ¥${value.toLocaleString()}`,
                        `損益: ¥${trade.profitLoss.toLocaleString()}`,
                        `リターン: ${trade.returnPercent.toFixed(2)}%`,
                        `日付: ${date}`
                      ];
                    }
                  }
                }
                return `¥${value.toLocaleString()}`;
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              name="株価"
              type="monotone"
              dataKey="Close"
              stroke="#6366f1"
              dot={false}
              strokeWidth={2}
            />
            {/* 取引ポイントを表示 */}
            <Scatter
              name="▲ 買いエントリー"
              data={chartData.filter(d => d.signal === 'buy')}
              dataKey="Close"
              fill="#34d399"
              shape={BuyMarker}
            />
            <Scatter
              name="× 売り決済"
              data={chartData.filter(d => d.signal === 'sell')}
              dataKey="Close"
              fill="#fb7185"
              shape={SellMarker}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RSIチャート */}
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            syncId="stockChart"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="Date"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(date) => date.split('-').slice(1).join('/')}
            />
            <YAxis
              tick={{ fill: '#94a3b8' }}
              domain={[0, 100]}
              ticks={[0, 30, 70, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '0.375rem',
              }}
              itemStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#a78bfa"
              dot={false}
              strokeWidth={2}
            />
            {/* RSIのしきい値ライン */}
            <Line
              type="monotone"
              dataKey={() => 70}
              stroke="#fb7185"
              strokeDasharray="3 3"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={() => 30}
              stroke="#34d399"
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
