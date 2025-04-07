'use client';

import { useState } from 'react';

interface MASettingsProps {
  onChange: (settings: MASettingsData) => void;
}

export interface MASettingsData {
  period: number;
  type: 'SMA' | 'EMA';
}

export default function MASettings({ onChange }: MASettingsProps) {
  const [settings, setSettings] = useState<MASettingsData>({
    period: 20,
    type: 'SMA',
  });

  const handleChange = (field: keyof MASettingsData, value: string) => {
    if(field === 'period') {
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
    if (field == 'type' && value !== 'SMA' && value !== 'EMA') return;

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
            移動平均期間
          </label>
          <input
            type="number"
            min="1"
            defaultValue="20"
            onChange={(e) => handleChange('period', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            移動平均タイプ
          </label>
          <select
            defaultValue="SMA"
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="SMA">単純移動平均 (SMA)</option>
            <option value="EMA">指数移動平均 (EMA)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
