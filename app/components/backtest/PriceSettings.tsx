'use client';

import { useState } from 'react';

interface PriceSettingsProps {
  onChange: (settings: PriceSettingsData) => void;
}

export interface PriceSettingsData {
  priceType: 'open' | 'close';
  operator: '>' | '<' | '>=' | '<=' | '==';
  targetValue: number;
}

export default function PriceSettings({ onChange }: PriceSettingsProps) {
  const [settings, setSettings] = useState<PriceSettingsData>({
    priceType: 'open',
    operator: '>',
    targetValue: 0,
  });

  const handleChange = (field: keyof PriceSettingsData, value: string) => {
    if(field === 'targetValue') {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;

      const newSettings = {
        ...settings,
        [field]: numValue,
      };
  
      setSettings(newSettings);
      onChange(newSettings);
    }

    let newValue = value;
    if(field === 'priceType' && value !== 'open' && value !== 'close') return;
    if(field === 'operator' && value !== '>' && value !== '<' && value !== '>=' && value !== '<=' && value !== '==') return;

    const newSettings = {
      ...settings,
      [field]: newValue,
    };

    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            価格タイプ
          </label>
          <select
            defaultValue="open"
            onChange={(e) => handleChange('priceType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="open">始値</option>
            <option value="close">終値</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            条件
          </label>
          <select
            defaultValue=">"
            onChange={(e) => handleChange('operator', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value=">">より大きい</option>
            <option value="<">より小さい</option>
            <option value=">=">以上</option>
            <option value="<=">以下</option>
            <option value="==">等しい</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            価格
          </label>
          <input
            type="number"
            min="0"
            defaultValue="0"
            onChange={(e) => handleChange('targetValue', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}