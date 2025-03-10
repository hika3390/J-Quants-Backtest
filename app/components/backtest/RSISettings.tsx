'use client';

interface RSISettingsProps {
  onChange: (settings: RSISettingsData) => void;
}

export interface RSISettingsData {
  period: number;
  overboughtThreshold: number;
  oversoldThreshold: number;
}

export default function RSISettings({ onChange }: RSISettingsProps) {
  const handleChange = (field: keyof RSISettingsData, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    onChange({
      period: field === 'period' ? numValue : 14,
      overboughtThreshold: field === 'overboughtThreshold' ? numValue : 70,
      oversoldThreshold: field === 'oversoldThreshold' ? numValue : 30,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            RSI期間
          </label>
          <input
            type="number"
            min="1"
            defaultValue="14"
            onChange={(e) => handleChange('period', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            買われ過ぎ（RSI上限）
          </label>
          <input
            type="number"
            min="0"
            max="100"
            defaultValue="70"
            onChange={(e) => handleChange('overboughtThreshold', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            売られ過ぎ（RSI下限）
          </label>
          <input
            type="number"
            min="0"
            max="100"
            defaultValue="30"
            onChange={(e) => handleChange('oversoldThreshold', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
