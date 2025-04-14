'use client';

import { memo } from 'react';
import { ConditionGroup, TabType } from '@/app/types/backtest';
import ConditionForm from './ConditionForm';

interface Props {
  type: TabType;
  value: ConditionGroup;
  onChange: (group: ConditionGroup) => void;
}

const ConditionGroupForm = memo(({ type, value, onChange }: Props) => {
  const handleOperatorChange = (newOperator: 'AND' | 'OR') => {
    onChange({
      ...value,
      operator: newOperator
    });
  };

  const handleConditionChange = (index: number, condition: any) => {
    if (!condition) return;
    const newConditions = [...value.conditions];
    newConditions[index] = condition;
    onChange({
      ...value,
      conditions: newConditions
    });
  };

  const handleAddCondition = () => {
    onChange({
      ...value,
      conditions: [...value.conditions, {
        indicator: 'rsi',
        period: 14,
        params: { overboughtThreshold: 70, oversoldThreshold: 30 }
      }]
    });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = value.conditions.filter((_, i) => i !== index);
    onChange({
      ...value,
      conditions: newConditions
    });
  };

  return (
    <div className="space-y-4">
      {/* 論理演算子の選択 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">条件の組み合わせ:</span>
        <select
          value={value.operator}
          onChange={(e) => handleOperatorChange(e.target.value as 'AND' | 'OR')}
          className="h-8 px-2 bg-slate-600 rounded text-xs focus:ring-1 focus:ring-slate-500"
        >
          <option value="AND">すべての条件を満たす (AND)</option>
          <option value="OR">いずれかの条件を満たす (OR)</option>
        </select>
      </div>

      {/* 条件リスト */}
      <div className="space-y-4">
        {value.conditions.map((condition, index) => (
          <div key={index} className="relative bg-slate-800 rounded p-4">
            {/* 削除ボタン */}
            {value.conditions.length > 1 && (
              <button
                onClick={() => handleRemoveCondition(index)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            <ConditionForm
              type={type}
              currentValue={condition}
              onChange={(newCondition) => handleConditionChange(index, newCondition)}
            />
          </div>
        ))}
      </div>

      {/* 条件追加ボタン */}
      <button
        type="button"
        onClick={handleAddCondition}
        className="w-full h-10 border-2 border-dashed border-slate-500 hover:border-slate-400 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>条件を追加</span>
      </button>
    </div>
  );
});

ConditionGroupForm.displayName = 'ConditionGroupForm';

export default ConditionGroupForm;
