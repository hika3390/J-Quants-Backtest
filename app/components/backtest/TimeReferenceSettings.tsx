'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';
import { timeReferences } from '@/app/constants/indicators';

export interface TimeReferenceSettingsData {
  timeReference: string;
  period: number;
}

interface TimeReferenceSettingsProps {
  initialValue?: TimeReferenceSettingsData;
  onChange: (settings: TimeReferenceSettingsData) => void;
}

const TimeReferenceSettings = memo(({ initialValue, onChange }: TimeReferenceSettingsProps) => {
  const [settings, setSettings] = useState<TimeReferenceSettingsData>({
    timeReference: initialValue?.timeReference || 'current',
    period: initialValue?.period || 0
  });

  useEffect(() => {
    onChange(settings);
  }, [settings, onChange]);

  const handleTimeReferenceChange = (value: string) => {
    const newSettings = { ...settings, timeReference: value };
    setSettings(newSettings);
  };

  const handlePeriodChange = (value: number) => {
    const newSettings = { ...settings, period: value };
    setSettings(newSettings);
  };

  return (
    <div className="space-y-4">
      <FormField label="時間参照">
        <select
          value={settings.timeReference}
          onChange={(e) => handleTimeReferenceChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {timeReferences.map((ref) => (
            <option key={ref.value} value={ref.value}>
              {ref.label}
            </option>
          ))}
        </select>
      </FormField>

      {settings.timeReference !== 'current' && (
        <FormField label="参照期間">
          <input
            type="number"
            min="1"
            value={settings.period}
            onChange={(e) => handlePeriodChange(Number(e.target.value))}
            className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
          />
        </FormField>
      )}
    </div>
  );
});

TimeReferenceSettings.displayName = 'TimeReferenceSettings';

export default TimeReferenceSettings;
