'use client';

import { memo, useState } from 'react';
import { FormField } from '../common/FormComponents';
import { TabType } from '../../types/backtest';
import { indicators } from '@/app/constants/indicators';
import RSISettings, { RSISettingsData } from './RSISettings';
import MASettings, { MASettingsData } from './MASettings';
import PriceSettings, { PriceSettingsData } from './PriceSettings';
import ProfitLossSettings, { ProfitLossSettingsData } from './ProfitLossSettings';

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
    currentValue?.indicator || (type === 'tp' || type === 'sl' ? 'profit_loss_percent' : 'rsi')
  );

  // インジケーター選択が変更されたときの処理
  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    // デフォルト値で新しい条件を作成
    const indicator = indicators.find(i => i.id === indicatorId);
    if (indicator) {
      const defaultCondition: Condition = {
        indicator: indicatorId,
        period: indicator.defaultPeriod || 1,
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

  // 価格設定が変更されたときの処理
  const handlePriceChange = (settings: PriceSettingsData) => {
    const condition: Condition = {
      indicator: 'price',
      period: 1,
      params: {
        'priceType': settings.priceType,
        'operator': settings.operator,
        'targetValue': settings.targetValue
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
          {indicators
            .filter(indicator => {
              // 利確/損切り条件の場合のみ損益関連のインジケーターを表示
              if (['profit_loss_percent', 'profit_loss_amount'].includes(indicator.id)) {
                return type === 'tp' || type === 'sl';
              }
              return true;
            })
            .map((indicator) => (
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

      {selectedIndicator === 'price' && (
        <PriceSettings
          onChange={handlePriceChange}
        />
      )}

      {selectedIndicator === 'profit_loss_percent' && (
        <ProfitLossSettings
          type="percent"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_percent',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {selectedIndicator === 'profit_loss_amount' && (
        <ProfitLossSettings
          type="amount"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_amount',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
