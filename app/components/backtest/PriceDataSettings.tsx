'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';
import TimeReferenceSettings, { TimeReferenceSettingsData } from './TimeReferenceSettings';
import ComparisonSettings, { ComparisonSettingsData } from './ComparisonSettings';

export interface PriceDataSettingsData {
  priceType: string;
  timeReference: string;
  refPeriod: number;
  operator: string;
  targetValue: number;
}

interface PriceDataSettingsProps {
  initialValue?: PriceDataSettingsData;
  onChange: (settings: PriceDataSettingsData) => void;
  indicatorId: string;
}

const PriceDataSettings = memo(({ initialValue, onChange, indicatorId }: PriceDataSettingsProps) => {
  const [settings, setSettings] = useState<PriceDataSettingsData>({
    priceType: initialValue?.priceType || 'close',
    timeReference: initialValue?.timeReference || 'current',
    refPeriod: initialValue?.refPeriod || 0,
    operator: initialValue?.operator || '>',
    targetValue: initialValue?.targetValue || 0
  });

  useEffect(() => {
    onChange(settings);
  }, [settings, onChange]);

  const handlePriceTypeChange = (value: string) => {
    const newSettings = { ...settings, priceType: value };
    setSettings(newSettings);
  };

  const handleTimeReferenceChange = (timeRefSettings: TimeReferenceSettingsData) => {
    const newSettings = { 
      ...settings, 
      timeReference: timeRefSettings.timeReference,
      refPeriod: timeRefSettings.period
    };
    setSettings(newSettings);
  };

  const handleComparisonChange = (comparisonSettings: ComparisonSettingsData) => {
    const newSettings = { 
      ...settings, 
      operator: comparisonSettings.operator,
      targetValue: comparisonSettings.targetValue
    };
    setSettings(newSettings);
  };

  // インジケーターに応じたラベルとオプションを設定
  let priceTypeLabel = '価格タイプ';
  let priceTypeOptions = [
    { value: 'open', label: '始値' },
    { value: 'close', label: '終値' },
    { value: 'high', label: '高値' },
    { value: 'low', label: '安値' },
    { value: 'adjustmentClose', label: '調整後終値' },
    { value: 'vwap', label: 'VWAP' }
  ];

  if (indicatorId === 'volume') {
    priceTypeLabel = '出来高';
    priceTypeOptions = [{ value: 'volume', label: '出来高' }];
  } else if (indicatorId === 'turnover_value') {
    priceTypeLabel = '売買代金';
    priceTypeOptions = [{ value: 'turnoverValue', label: '売買代金' }];
  } else if (indicatorId === 'market_cap') {
    priceTypeLabel = '時価総額';
    priceTypeOptions = [{ value: 'marketCap', label: '時価総額' }];
  } else if (indicatorId === 'per') {
    priceTypeLabel = 'PER';
    priceTypeOptions = [{ value: 'per', label: 'PER (株価収益率)' }];
  } else if (indicatorId === 'pbr') {
    priceTypeLabel = 'PBR';
    priceTypeOptions = [{ value: 'pbr', label: 'PBR (株価純資産倍率)' }];
  } else if (indicatorId === 'dividend_yield') {
    priceTypeLabel = '配当利回り';
    priceTypeOptions = [{ value: 'dividendYield', label: '配当利回り' }];
  } else if (indicatorId === 'roe') {
    priceTypeLabel = 'ROE';
    priceTypeOptions = [{ value: 'roe', label: 'ROE (自己資本利益率)' }];
  } else if (indicatorId === 'roa') {
    priceTypeLabel = 'ROA';
    priceTypeOptions = [{ value: 'roa', label: 'ROA (総資産利益率)' }];
  }

  return (
    <div className="space-y-4">
      <FormField label={priceTypeLabel}>
        <select
          value={settings.priceType}
          onChange={(e) => handlePriceTypeChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {priceTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <TimeReferenceSettings
        initialValue={{
          timeReference: settings.timeReference,
          period: settings.refPeriod
        }}
        onChange={handleTimeReferenceChange}
      />

      <ComparisonSettings
        initialValue={{
          operator: settings.operator,
          targetValue: settings.targetValue
        }}
        onChange={handleComparisonChange}
      />
    </div>
  );
});

PriceDataSettings.displayName = 'PriceDataSettings';

export default PriceDataSettings;
