'use client';

import { memo } from 'react';
import { FormField } from '../common/FormComponents';

export interface PriceSettingsData {
  priceType: 'open' | 'close';
  operator: '>' | '<' | '>=' | '<=' | '==';
  targetValue: number;
}

interface PriceSettingsProps {
  onChange: (settings: PriceSettingsData) => void;
  currentValue?: PriceSettingsData;
}

const PriceSettings = memo(({ onChange, currentValue = { priceType: 'close', operator: '>', targetValue: 0 } }: PriceSettingsProps) => {
  return (
    <div className="flex items-center gap-4">
      <FormField label="価格タイプ" className="flex-1">
        <select
          value={currentValue.priceType}
          onChange={(e) => onChange({ ...currentValue, priceType: e.target.value as 'open' | 'close' })}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
        >
          <option value="open">始値</option>
          <option value="close">終値</option>
        </select>
      </FormField>

      <FormField label="条件" className="flex-1">
        <select
          value={currentValue.operator}
          onChange={(e) => onChange({ ...currentValue, operator: e.target.value as '>' | '<' | '>=' | '<=' | '==' })}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
        >
          <option value=">">より大きい</option>
          <option value="<">より小さい</option>
          <option value=">=">以上</option>
          <option value="<=">以下</option>
          <option value="==">等しい</option>
        </select>
      </FormField>

      <FormField label="価格" className="flex-1">
        <input
          type="number"
          value={currentValue.targetValue.toString()}
          onChange={(e) => onChange({ ...currentValue, targetValue: Number(e.target.value) })}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
        />
      </FormField>
    </div>
  );
});

PriceSettings.displayName = 'PriceSettings';

export default PriceSettings;
