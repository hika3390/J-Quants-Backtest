'use client';

import { useState } from 'react';
import { FormSection } from '../common/FormComponents';
import TabButton from './TabButton';
import BasicSettings from './BasicSettings';
import FundSettings from './FundSettings';
import ConditionForm from './ConditionForm';
import { TabType, TAB_LABELS } from '../../types/backtest';

export default function BacktestSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('buy');

  return (
    <div className="space-y-6">
      <FormSection title="基本設定">
        <BasicSettings />
      </FormSection>

      <FormSection title="資金・ポジション設定">
        <FundSettings />
      </FormSection>

      <FormSection title="条件式の設定">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="bg-slate-700/50 rounded p-4">
            <ConditionForm type={activeTab} />
          </div>
        </div>
      </FormSection>

      <div className="text-center pt-4">
        <button
          type="button"
          className="h-10 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
        >
          バックテストを実行
        </button>
      </div>
    </div>
  );
}
