'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';
import { TabType } from '../../types/backtest';
import { indicators } from '@/app/constants/indicators';
import RSISettings, { RSISettingsData } from './RSISettings';
import MASettings, { MASettingsData } from './MASettings';

interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number | string>;
}

interface ConditionFormProps {
  type: TabType;
  currentValue?: Condition;
  onChange: (condition: Condition | null) => void;
}

const ConditionForm = memo(({ type, currentValue, onChange }: ConditionFormProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>(
    currentValue?.indicator || 'rsi'
  );

  // インジケーター選択が変更されたときの処理
  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    // デフォルト値で新しい条件を作成
    const indicator = indicators.find(i => i.id === indicatorId);
    if (indicator) {
      const defaultCondition: Condition = {
        indicator: indicatorId,
        period: indicator.defaultPeriod,
        params: {}
      };
      onChange(defaultCondition);
    }
  };

  // RSI設定が変更されたときの処理
  const handleRSIChange = (settings: RSISettingsData) => {
    const condition: Condition = {
      indicator: 'rsi',
      period: settings.period,
      params: {
        'overboughtThreshold': settings.overboughtThreshold,
        'oversoldThreshold': settings.oversoldThreshold
      }
    };
    onChange(condition);
  };

  // MA設定が変更されたときの処理
  const handleMAChange = (settings: MASettingsData) => {
    const condition: Condition = {
      indicator: 'ma',
      period: settings.period,
      params: {
        'type': settings.type
      }
    };
    onChange(condition);
  };

  return (
    <div className="space-y-4">
      <FormField label="インジケーター">
        <select
          value={selectedIndicator}
          onChange={(e) => handleIndicatorChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {indicators.map((indicator) => (
            <option key={indicator.id} value={indicator.id}>
              {indicator.name}
            </option>
          ))}
        </select>
      </FormField>

      {selectedIndicator === 'rsi' && (
        <RSISettings
          onChange={handleRSIChange}
        />
      )}

      {selectedIndicator === 'ma' && (
        <MASettings
          onChange={handleMAChange}
        />
      )}
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
