'use client';

import { memo } from 'react';
import { FormField } from '../common/FormComponents';

const BasicSettings = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField label="開始日">
      <input
        type="date"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="終了日">
      <input
        type="date"
        className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500"
      />
    </FormField>
    <FormField label="銘柄">
      <select className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none">
        <option value="" className="bg-slate-800">選択してください</option>
        <option value="USDJPY" className="bg-slate-800">USD/JPY</option>
        <option value="EURJPY" className="bg-slate-800">EUR/JPY</option>
        <option value="GBPJPY" className="bg-slate-800">GBP/JPY</option>
      </select>
    </FormField>
  </div>
));

BasicSettings.displayName = 'BasicSettings';

export default BasicSettings;
