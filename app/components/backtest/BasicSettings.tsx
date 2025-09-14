'use client';

import { memo, useState, useEffect } from 'react';
import { FormField } from '../common/FormComponents';

export interface BasicSettingsData {
  code: string;
  startDate: string;
  endDate: string;
}

interface BasicSettingsProps {
  onChange?: (data: BasicSettingsData) => void;
  initialValues?: BasicSettingsData;
}

const BasicSettings = memo(({ onChange, initialValues }: BasicSettingsProps) => {

  // 本日の日付を取得
  const today = new Date().toISOString().split('T')[0];
  // デフォルトの開始日（3ヶ月前）
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 3);
  const threeMonthsAgo = defaultStartDate.toISOString().split('T')[0];

  // 状態管理
  const [currentValues, setCurrentValues] = useState<BasicSettingsData>({
    code: '',
    startDate: threeMonthsAgo,
    endDate: today,
  });

  // 初期値が提供された場合に状態を更新（初回のみ）
  useEffect(() => {
    if (initialValues && (
      initialValues.code !== currentValues.code ||
      initialValues.startDate !== currentValues.startDate ||
      initialValues.endDate !== currentValues.endDate
    )) {
      setCurrentValues(initialValues);
    }
  }, [initialValues]);
  const [codeError, setCodeError] = useState<string>('');

  // 証券コードのバリデーション
  const validateCode = (code: string): boolean => {
    if (!code) {
      setCodeError('証券コードを入力してください');
      return false;
    }
    if (!/^\d{4}$/.test(code)) {
      setCodeError('証券コードは4桁の数字で入力してください');
      return false;
    }
    setCodeError('');
    return true;
  };

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
          value={currentValues.startDate}
          max={today}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
        />
      </FormField>
      <FormField label="終了日">
        <input
          type="date"
          value={currentValues.endDate}
          max={today}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
        />
      </FormField>
      <div className="space-y-4">
        <FormField label="証券コード" error={codeError}>
          <input
            type="text"
            value={currentValues.code}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d{0,4}$/.test(value)) {
                handleChange('code', value);
                if (value) validateCode(value);
              }
            }}
            placeholder="例: 7203"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:border-gray-500 focus:outline-none transition-base"
          />
        </FormField>

        <FormField label="サンプル銘柄">
          <select
            value={currentValues.code}
            onChange={(e) => {
              handleChange('code', e.target.value);
              setCodeError('');
            }}
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
    </div>
  );
});

BasicSettings.displayName = 'BasicSettings';

export default BasicSettings;
