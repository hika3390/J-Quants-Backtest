'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';
import { comparisonOperators } from '@/app/constants/indicators';

export interface ComparisonSettingsData {
  operator: string;
  targetValue: number;
}

interface ComparisonSettingsProps {
  initialValue?: ComparisonSettingsData;
  onChange: (settings: ComparisonSettingsData) => void;
  label?: string;
  disableOption?: boolean;
}

const ComparisonSettings = memo(({ initialValue, onChange, label = '条件', disableOption = false }: ComparisonSettingsProps) => {
  const [settings, setSettings] = useState<ComparisonSettingsData>({
    operator: initialValue?.operator || '>',
    targetValue: initialValue?.targetValue || 0
  });

  useEffect(() => {
    onChange(settings);
  }, [settings, onChange]);

  const handleOperatorChange = (value: string) => {
    const newSettings = { ...settings, operator: value };
    setSettings(newSettings);
  };

  const handleTargetValueChange = (value: number) => {
    const newSettings = { ...settings, targetValue: value };
    setSettings(newSettings);
  };

  return (
    <div className="space-y-4">
      <FormField label={label}>
        <select
          value={settings.operator}
          onChange={(e) => handleOperatorChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {comparisonOperators
            .filter(op => !disableOption || op.value !== 'disabled')
            .map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
        </select>
      </FormField>

      {settings.operator !== 'disabled' && (
        <FormField label="値">
          <input
            type="number"
            value={settings.targetValue}
            onChange={(e) => handleTargetValueChange(Number(e.target.value))}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
          />
        </FormField>
      )}
    </div>
  );
});

ComparisonSettings.displayName = 'ComparisonSettings';

export default ComparisonSettings;
