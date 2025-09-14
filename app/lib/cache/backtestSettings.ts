'use client';

import { BasicSettingsData } from '@/app/components/backtest/BasicSettings';
import { FundSettingsData } from '@/app/components/backtest/FundSettings';
import { ConditionGroup, TabType } from '@/app/types/backtest';

interface BacktestSettingsCache {
  basicSettings: BasicSettingsData;
  fundSettings: FundSettingsData;
  conditions: Partial<Record<TabType, ConditionGroup>>;
  lastSaved: string;
}

const CACHE_KEY = 'backtest_settings_cache';
const CACHE_EXPIRY_HOURS = 24; // 24時間でキャッシュを期限切れにする

/**
 * バックテスト設定をLocalStorageに保存
 */
export function saveBacktestSettings(
  basicSettings: BasicSettingsData,
  fundSettings: FundSettingsData,
  conditions: Partial<Record<TabType, ConditionGroup>>
): void {
  try {
    const cache: BacktestSettingsCache = {
      basicSettings,
      fundSettings,
      conditions,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('バックテスト設定をキャッシュに保存しました');
  } catch (error) {
    console.warn('バックテスト設定の保存に失敗しました:', error);
  }
}

/**
 * LocalStorageからバックテスト設定を取得
 */
export function loadBacktestSettings(): BacktestSettingsCache | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const cache: BacktestSettingsCache = JSON.parse(cached);

    // キャッシュの有効期限をチェック
    const lastSaved = new Date(cache.lastSaved);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > CACHE_EXPIRY_HOURS) {
      localStorage.removeItem(CACHE_KEY);
      console.log('キャッシュの有効期限が切れています');
      return null;
    }

    console.log('バックテスト設定をキャッシュから復元しました');
    return cache;
  } catch (error) {
    console.warn('バックテスト設定の読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * キャッシュをクリア
 */
export function clearBacktestSettingsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('バックテスト設定のキャッシュをクリアしました');
  } catch (error) {
    console.warn('キャッシュのクリアに失敗しました:', error);
  }
}

/**
 * キャッシュが存在するかチェック
 */
export function hasBacktestSettingsCache(): boolean {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const cache: BacktestSettingsCache = JSON.parse(cached);
    const lastSaved = new Date(cache.lastSaved);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= CACHE_EXPIRY_HOURS;
  } catch {
    return false;
  }
}