'use client';

import { FormField } from '../common/FormComponents';

interface BollingerSettingsProps {
  period: number;
  priceType: string;
  stdDev: string;
  onChange: (params: { priceType: string; stdDev: string }) => void;
}

export default function BollingerSettings({
  period,
  priceType,
  stdDev,
  onChange
}: BollingerSettingsProps) {

  const handlePriceTypeChange = (value: string) => {
    onChange({ priceType: value, stdDev });
  };

  const handleStdDevChange = (value: string) => {
    onChange({ priceType, stdDev: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="期間">
          <input
            type="number"
            value={period}
            disabled
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-400 cursor-not-allowed"
            title="期間は条件の基本設定で変更できます"
          />
        </FormField>

        <FormField label="価格タイプ">
          <select
            value={priceType}
            onChange={(e) => handlePriceTypeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="open">始値</option>
            <option value="close">終値</option>
            <option value="high">高値</option>
            <option value="low">安値</option>
            <option value="adjustmentClose">調整後終値</option>
            <option value="vwap">VWAP</option>
          </select>
        </FormField>

        <FormField label="標準偏差（σ）">
          <select
            value={stdDev}
            onChange={(e) => handleStdDevChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="1">1σ (約68%)</option>
            <option value="2">2σ (約95%)</option>
            <option value="3">3σ (約99%)</option>
          </select>
        </FormField>
      </div>

      <div className="bg-slate-700/50 p-3 rounded text-sm text-slate-400">
        <h4 className="font-medium mb-2">ボリンジャーバンドについて</h4>
        <ul className="space-y-1 text-xs">
          <li>• 移動平均線を中心に標準偏差の幅でバンドを描画</li>
          <li>• 価格がバンドを超えた際にシグナルを生成</li>
          <li>• 上限超え: 売りシグナル（買われ過ぎ）</li>
          <li>• 下限超え: 買いシグナル（売られ過ぎ）</li>
          <li>• 標準偏差が大きいほど、バンドの幅が広くなります</li>
        </ul>
      </div>
    </div>
  );
}