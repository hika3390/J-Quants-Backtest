'use client';

import { memo } from 'react';
import { FormField } from '../common/FormComponents';

const FundSettings = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField label="初期資金">
      <input
        type="number"
        placeholder="例: 1000000"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="最大保有銘柄数">
      <input
        type="number"
        placeholder="例: 5"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="レバレッジ">
      <input
        type="number"
        placeholder="例: 1"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
  </div>
));

FundSettings.displayName = 'FundSettings';

export default FundSettings;
