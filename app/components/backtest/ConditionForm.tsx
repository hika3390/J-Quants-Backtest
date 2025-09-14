'use client';

import { memo, useState } from 'react';
import { FormField } from '../common/FormComponents';
import { TabType } from '../../types/backtest';
import { indicators, indicatorCategories } from '@/app/constants/indicators';
import RSISettings, { RSISettingsData } from './RSISettings';
import MASettings, { MASettingsData } from './MASettings';
import PriceSettings, { PriceSettingsData } from './PriceSettings';
import ProfitLossSettings from './ProfitLossSettings';
import PriceDataSettings from './PriceDataSettings';
import CompanyInfoSettings from './CompanyInfoSettings';
import BollingerSettings from './BollingerSettings';

interface Condition {
  indicator: string;
  period: number;
  params: Record<string, number | string>;
}

interface ConditionFormProps {
  type: TabType;
  currentValue?: Condition;
  onChange: (condition: Condition | null) => void;
  otherConditions?: { buy?: Condition[], sell?: Condition[] };
}

const ConditionForm = memo(({ type, currentValue, onChange, otherConditions }: ConditionFormProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>(
    currentValue?.indicator || (type === 'tp' || type === 'sl' ? 'profit_loss_percent' : 'rsi')
  );

  // 他の条件で「条件を指定しない」が選択されているかチェック
  const isNoConditionSelectedElsewhere = () => {
    if (type === 'buy') {
      return otherConditions?.sell?.some(condition => condition.indicator === 'no_condition') || false;
    }
    if (type === 'sell') {
      return otherConditions?.buy?.some(condition => condition.indicator === 'no_condition') || false;
    }
    return false;
  };

  const isNoConditionDisabled = isNoConditionSelectedElsewhere();

  // インジケーター選択が変更されたときの処理
  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    // デフォルト値で新しい条件を作成
    const indicator = indicators.find(i => i.id === indicatorId);
    if (indicator) {
      const defaultCondition: Condition = {
        indicator: indicatorId,
        period: indicator.defaultPeriod || 1,
        params: {}
      };

      // ボリンジャーバンドの場合はデフォルトパラメータを設定
      if (indicatorId === 'bollinger') {
        defaultCondition.params = {
          '価格タイプ': 'close',
          '標準偏差': '2'
        };
      }

      onChange(defaultCondition);
    }
  };

  // RSI設定が変更されたときの処理
  const handleRSIChange = (settings: RSISettingsData) => {
    const condition: Condition = {
      indicator: 'rsi',
      period: settings.period,
      params: {
        'overboughtThreshold': settings.overboughtThreshold,
        'oversoldThreshold': settings.oversoldThreshold
      }
    };
    onChange(condition);
  };

  // MA設定が変更されたときの処理
  const handleMAChange = (settings: MASettingsData) => {
    const condition: Condition = {
      indicator: 'ma',
      period: settings.period,
      params: {
        'type': settings.type
      }
    };
    onChange(condition);
  };

  // 価格設定が変更されたときの処理
  const handlePriceChange = (settings: PriceSettingsData) => {
    const condition: Condition = {
      indicator: 'price',
      period: 1,
      params: {
        'priceType': settings.priceType,
        'operator': settings.operator,
        'targetValue': settings.targetValue
      }
    };
    onChange(condition);
  };

  // ボリンジャーバンド設定が変更されたときの処理
  const handleBollingerChange = (params: { priceType: string; stdDev: string }) => {
    const condition: Condition = {
      indicator: 'bollinger',
      period: currentValue?.period || 20,
      params: {
        '価格タイプ': params.priceType,
        '標準偏差': params.stdDev
      }
    };
    onChange(condition);
  };

  return (
    <div className="space-y-4">
      <FormField label="インジケーター">
        <select
          value={selectedIndicator}
          onChange={(e) => handleIndicatorChange(e.target.value)}
          className="w-full h-10 px-3 bg-slate-700 rounded text-slate-200 border-0 focus:ring-1 focus:ring-slate-500 appearance-none"
        >
          {/* 利確/損切り条件の場合のみポジション管理カテゴリを表示 */}
          {(type === 'tp' || type === 'sl') && (
            <optgroup label="ポジション管理">
              {indicators
                .filter(indicator => indicator.category === 'position')
                .map((indicator) => (
                  <option key={indicator.id} value={indicator.id}>
                    {indicator.name}
                  </option>
                ))}
            </optgroup>
          )}

          {/* カテゴリごとにインジケーターをグループ化（ポジション管理カテゴリは除外） */}
          {indicatorCategories
            .filter(category => category.id !== 'position') // ポジション管理カテゴリは上部で別途表示するため除外
            .map(category => {
              const categoryIndicators = indicators.filter(
                indicator => indicator.category === category.id
              );

              if (categoryIndicators.length === 0) return null;

              return (
                <optgroup key={category.id} label={category.name}>
                  {categoryIndicators.map(indicator => (
                    <option
                      key={indicator.id}
                      value={indicator.id}
                      disabled={indicator.id === 'no_condition' && isNoConditionDisabled}
                    >
                      {indicator.name}
                      {indicator.id === 'no_condition' && isNoConditionDisabled ? ' (他の条件で既に選択済み)' : ''}
                    </option>
                  ))}
                </optgroup>
              );
            })}
        </select>
      </FormField>

      {selectedIndicator === 'rsi' && (
        <RSISettings
          onChange={handleRSIChange}
        />
      )}

      {selectedIndicator === 'ma' && (
        <MASettings
          onChange={handleMAChange}
        />
      )}

      {selectedIndicator === 'bollinger' && (
        <BollingerSettings
          period={currentValue?.period || 20}
          priceType={(currentValue?.params?.['価格タイプ'] || currentValue?.params?.priceType || 'close') as string}
          stdDev={(currentValue?.params?.['標準偏差'] || currentValue?.params?.stdDev || '2') as string}
          onChange={handleBollingerChange}
        />
      )}

      {selectedIndicator === 'price' && (
        <PriceSettings
          onChange={handlePriceChange}
        />
      )}

      {selectedIndicator === 'profit_loss_percent' && (
        <ProfitLossSettings
          type="percent"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_percent',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {selectedIndicator === 'profit_loss_amount' && (
        <ProfitLossSettings
          type="amount"
          onChange={(settings) => {
            const condition: Condition = {
              indicator: 'profit_loss_amount',
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {/* 価格データ関連のインジケーター */}
      {['price_comparison', 'volume', 'turnover_value', 'market_cap',
        'per', 'pbr', 'dividend_yield', 'eps', 'bps', 'roe', 'roa', 'equity_ratio',
        'revenue', 'operating_income', 'ordinary_income', 'net_income',
        'total_assets', 'net_assets', 'cash_flow'].includes(selectedIndicator) && (
        <PriceDataSettings
          indicatorId={selectedIndicator}
          onChange={(settings) => {
            const condition: Condition = {
              indicator: selectedIndicator,
              period: 1,
              params: {
                priceType: settings.priceType,
                timeReference: settings.timeReference,
                refPeriod: settings.refPeriod,
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {/* 企業・市場情報関連のインジケーター */}
      {['market', 'industry', 'sector'].includes(selectedIndicator) && (
        <CompanyInfoSettings
          indicatorId={selectedIndicator}
          onChange={(settings) => {
            const condition: Condition = {
              indicator: selectedIndicator,
              period: 1,
              params: {
                operator: settings.operator,
                targetValue: settings.targetValue
              }
            };
            onChange(condition);
          }}
        />
      )}

      {/* 条件を指定しない場合の表示 */}
      {selectedIndicator === 'no_condition' && (
        <div className="bg-slate-600/30 rounded p-4 text-center">
          <p className="text-slate-300 text-sm">
            この条件は無効になります。売買シグナルは発生しません。
          </p>
        </div>
      )}

      {/* 無効化されている場合の警告メッセージ */}
      {isNoConditionDisabled && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-yellow-500 text-sm font-medium">
              「条件を指定しない」は{type === 'buy' ? '売り条件' : '買い条件'}で既に選択されているため使用できません。
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

ConditionForm.displayName = 'ConditionForm';

export default ConditionForm;
