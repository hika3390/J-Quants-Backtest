'use client';

import { useState } from 'react';

interface Props {
  type: 'percent' | 'amount';
  onChange: (data: ProfitLossSettingsData) => void;
}

export interface ProfitLossSettingsData {
  operator: string;
  targetValue: number;
}

export default function ProfitLossSettings({ type, onChange }: Props) {
	const [settings, setSettings] = useState<ProfitLossSettingsData>({
		operator: '>',
		targetValue: 20,
	});

  const handleChange = (field: keyof ProfitLossSettingsData, value: string) => {
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

		const newValue = value;
    if (field == 'operator' && value !== '>' && value !== '<' && value !== '>=' && value !== '<=' && value !== '==' && value !== 'disabled') return;

    const newSettings = {
      ...settings,
      [field]: newValue,
    };

    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <option value="disabled">無効（損切りなし）</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {type === 'percent' ? '損益率 (%)' : '損益額 (円)'}
          </label>
          <input
            type="number"
            min="0"
            defaultValue="20"
            onChange={(e) => handleChange('targetValue', e.target.value)}
            disabled={settings.operator === 'disabled'}
            className={`w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              settings.operator === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}
