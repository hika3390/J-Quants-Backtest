'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';
import { TabType } from '../../types/backtest';

interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number>;
}

interface ConditionFormProps {
  type: TabType;
  currentValue?: Condition;
  onChange: (condition: Condition | null) => void;
}

const ConditionForm = memo(({ type, currentValue, onChange }: ConditionFormProps) => {
  const [period, setPeriod] = useState<number>(currentValue?.period || 14);
  const [threshold, setThreshold] = useState<number>(
    currentValue?.params['標準偏差'] || (type === 'buy' ? 30 : 70)
  );

  // 外部から値が更新された場合に反映
  useEffect(() => {
    if (currentValue) {
      setPeriod(currentValue.period);
      setThreshold(currentValue.params['標準偏差']);
    }
  }, [currentValue]);

  // 値が変更されたときに親コンポーネントに通知
  const handleChange = () => {
    const condition: Condition = {
      indicator: 'rsi',
      period,
      params: {
        '標準偏差': threshold
      }
    };
    onChange(condition);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="RSI期間">
          <input
            type="number"
            value={period}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                setPeriod(value);
                handleChange();
              }
            }}
            min="1"
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
          />
        </FormField>
        <FormField label={type === 'buy' ? 'RSI下限（売られ過ぎ）' : 'RSI上限（買われ過ぎ）'}>
          <input
            type="number"
            value={threshold}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 100) {
                setThreshold(value);
                handleChange();
              }
            }}
            min="0"
            max="100"
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
          />
        </FormField>
      </div>
      <div className="text-sm text-slate-400">
        {type === 'buy' 
          ? 'RSIが下限値以下になったとき買い注文を出します' 
          : 'RSIが上限値以上になったとき売り注文を出します'}
      </div>
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
