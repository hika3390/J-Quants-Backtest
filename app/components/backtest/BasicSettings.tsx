'use client';

import { memo, useState } from 'react';
import { FormField } from '../common/FormComponents';

export interface BasicSettingsData {
  code: string;
  startDate: string;
  endDate: string;
}

interface BasicSettingsProps {
  onChange?: (data: BasicSettingsData) => void;
}

const BasicSettings = memo(({ onChange }: BasicSettingsProps) => {

  // 本日の日付を取得
  const today = new Date().toISOString().split('T')[0];
  // デフォルトの開始日（3ヶ月前）
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 3);
  const threeMonthsAgo = defaultStartDate.toISOString().split('T')[0];

  // 現在の値を保持するための状態
  const [currentValues, setCurrentValues] = useState<BasicSettingsData>({
    code: '',
    startDate: threeMonthsAgo,
    endDate: today,
  });

  const handleChange = (field: keyof BasicSettingsData, value: string) => {
    const newValues = {
      ...currentValues,
      [field]: value,
    };
    setCurrentValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField label="開始日">
        <input
          type="date"
          defaultValue={threeMonthsAgo}
          max={today}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
        />
      </FormField>
      <FormField label="終了日">
        <input
          type="date"
          defaultValue={today}
          max={today}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
        />
      </FormField>
      <FormField label="銘柄">
        <select
          defaultValue=""
          onChange={(e) => handleChange('code', e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
        >
          <option value="">選択してください</option>
          <optgroup label="日経225 (サンプル)">
            <option value="7203">トヨタ自動車(7203)</option>
            <option value="9984">ソフトバンクG(9984)</option>
            <option value="6758">ソニーG(6758)</option>
            <option value="8306">三菱UFJFG(8306)</option>
            <option value="6861">キーエンス(6861)</option>
            <option value="9432">日本電信電話(9432)</option>
            <option value="6367">ダイキン工業(6367)</option>
            <option value="7974">任天堂(7974)</option>
            <option value="6098">リクルートHD(6098)</option>
            <option value="4063">信越化学(4063)</option>
          </optgroup>
        </select>
      </FormField>
    </div>
  );
});

BasicSettings.displayName = 'BasicSettings';

export default BasicSettings;
