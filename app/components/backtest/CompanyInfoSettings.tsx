'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';

export interface CompanyInfoSettingsData {
  operator: string;
  targetValue: string;
}

interface CompanyInfoSettingsProps {
  initialValue?: CompanyInfoSettingsData;
  onChange: (settings: CompanyInfoSettingsData) => void;
  indicatorId: string;
}

const CompanyInfoSettings = memo(({ initialValue, onChange, indicatorId }: CompanyInfoSettingsProps) => {
  const [settings, setSettings] = useState<CompanyInfoSettingsData>({
    operator: initialValue?.operator || '==',
    targetValue: initialValue?.targetValue || ''
  });

  useEffect(() => {
    onChange(settings);
  }, [settings]);

  const handleOperatorChange = (value: string) => {
    const newSettings = { ...settings, operator: value };
    setSettings(newSettings);
  };

  const handleTargetValueChange = (value: string) => {
    const newSettings = { ...settings, targetValue: value };
    setSettings(newSettings);
  };

  // インジケーターに応じたラベルとオプションを設定
  let valueLabel = '値';
  let valueType = 'text';
  let valueOptions: { value: string; label: string }[] = [];
  
  if (indicatorId === 'market') {
    valueLabel = '市場区分';
    valueType = 'select';
    valueOptions = [
      { value: 'プライム', label: 'プライム' },
      { value: 'スタンダード', label: 'スタンダード' },
      { value: 'グロース', label: 'グロース' },
      { value: 'JASDAQ', label: 'JASDAQ' },
      { value: 'マザーズ', label: 'マザーズ' },
      { value: '東証1部', label: '東証1部' },
      { value: '東証2部', label: '東証2部' }
    ];
  } else if (indicatorId === 'industry') {
    valueLabel = '業種';
  } else if (indicatorId === 'sector') {
    valueLabel = 'セクター';
  }

  return (
    <div className="space-y-4">
      <FormField label="条件">
        <select
          value={settings.operator}
          onChange={(e) => handleOperatorChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          <option value="==">等しい (==)</option>
          <option value="!=">等しくない (!=)</option>
        </select>
      </FormField>

      <FormField label={valueLabel}>
        {valueType === 'select' ? (
          <select
            value={settings.targetValue}
            onChange={(e) => handleTargetValueChange(e.target.value)}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
          >
            {valueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={settings.targetValue}
            onChange={(e) => handleTargetValueChange(e.target.value)}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
          />
        )}
      </FormField>
    </div>
  );
});

CompanyInfoSettings.displayName = 'CompanyInfoSettings';

export default CompanyInfoSettings;
