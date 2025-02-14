'use client';

import { memo, useState } from 'react';
import { FormField } from '../common/FormComponents';
import { indicators } from '../../constants/indicators';
import { TabType } from '../../types/backtest';

interface ConditionFormProps {
  type: TabType;
}

const ConditionForm = memo(({}: ConditionFormProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const indicator = indicators.find(ind => ind.id === selectedIndicator);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="インジケーター">
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
          >
            <option value="" className="bg-slate-800">選択してください</option>
            {indicators.map(ind => (
              <option key={ind.id} value={ind.id} className="bg-slate-800">
                {ind.name}
              </option>
            ))}
          </select>
        </FormField>
        {selectedIndicator && (
          <>
            <FormField label="期間">
              <input
                type="number"
                defaultValue={indicator?.defaultPeriod}
              className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
              />
            </FormField>
            <FormField label="条件">
              <select className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500">
                <option value="" className="bg-slate-800">選択してください</option>
                {indicator?.parameters?.map(param => (
                  <option key={param.name} value={param.name} className="bg-slate-800">
                    {param.name}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        )}
      </div>
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
