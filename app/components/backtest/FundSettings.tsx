'use client';

interface FundSettingsProps {
  onChange: (settings: FundSettingsData) => void;
}

export interface FundSettingsData {
  initialCash: number;
  maxPosition: number;
}

export default function FundSettings({ onChange }: FundSettingsProps) {
  const handleChange = (field: keyof FundSettingsData, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    onChange({
      initialCash: field === 'initialCash' ? numValue : 1000000,
      maxPosition: field === 'maxPosition' ? numValue : 100,
    });
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
            defaultValue="1000000"
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
            defaultValue="100"
            onChange={(e) => handleChange('maxPosition', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
