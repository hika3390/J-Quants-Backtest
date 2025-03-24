'use client';

interface MASettingsProps {
  onChange: (settings: MASettingsData) => void;
}

export interface MASettingsData {
  period: number;
  type: 'SMA' | 'EMA';
}

export default function MASettings({ onChange }: MASettingsProps) {
  const handlePeriodChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    onChange({
      period: numValue,
      type: 'SMA', // デフォルト値を維持
    });
  };

  const handleTypeChange = (value: string) => {
    if (value !== 'SMA' && value !== 'EMA') return;

    onChange({
      period: 20, // デフォルト値を維持
      type: value,
    });
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
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            移動平均タイプ
          </label>
          <select
            defaultValue="SMA"
            onChange={(e) => handleTypeChange(e.target.value)}
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
