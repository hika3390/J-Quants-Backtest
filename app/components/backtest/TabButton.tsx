'use client';

import { memo } from 'react';
import { TabType, TAB_LABELS } from '../../types/backtest';

interface TabButtonProps {
  tab: TabType;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = memo(({ tab, isActive, onClick }: TabButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 h-10 rounded text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {TAB_LABELS[tab]}
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default TabButton;
