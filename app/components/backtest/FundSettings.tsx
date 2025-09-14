'use client';

import { useState, useEffect } from 'react';

interface FundSettingsProps {
  onChange: (settings: FundSettingsData) => void;
  initialValues?: FundSettingsData;
}

export interface FundSettingsData {
  initialCash: number;
  maxPosition: number;
}

export default function FundSettings({ onChange, initialValues }: FundSettingsProps) {
  const [currentValues, setCurrentValues] = useState<FundSettingsData>({
    initialCash: 1000000,
    maxPosition: 100
  });

  // 初期値が提供された場合に状態を更新（初回のみ）
  useEffect(() => {
    if (initialValues && (
      initialValues.initialCash !== currentValues.initialCash ||
      initialValues.maxPosition !== currentValues.maxPosition
    )) {
      setCurrentValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field: keyof FundSettingsData, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newValues = {
      ...currentValues,
      [field]: numValue
    };

    setCurrentValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            初期資金（円）
          </label>
          <input
            type="number"
            min="0"
            step="10000"
            value={currentValues.initialCash}
            onChange={(e) => handleChange('initialCash', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            最大ポジション（％）
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={currentValues.maxPosition}
            onChange={(e) => handleChange('maxPosition', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
