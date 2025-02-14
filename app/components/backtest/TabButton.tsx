'use client';

import { memo } from 'react';
import { TabType } from '../../types/backtest';

interface TabButtonProps {
  tab: TabType;
  isActive: boolean;
  onClick: () => void;
}

const labels: Record<TabType, string> = {
  buy: '買い条件',
  sell: '売り条件',
  tp: '利確条件',
  sl: '損切り条件'
};

const TabButton = memo(({ tab, isActive, onClick }: TabButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 h-10 rounded text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {labels[tab]}
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default TabButton;
