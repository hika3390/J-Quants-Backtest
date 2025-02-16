'use client';

import { useState, memo } from 'react';
import LogoutButton from './auth/LogoutButton';

// トグルスイッチコンポーネント
const ToggleSwitch = memo(({ enabled, onChange, label, description }: {
  enabled: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="flex-grow flex flex-col">
      <span className="text-base font-medium text-slate-200">{label}</span>
      <span className="text-sm text-slate-400">{description}</span>
    </span>
    <button
      type="button"
      className={`${
        enabled ? 'bg-indigo-500' : 'bg-slate-600'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
      onClick={onChange}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 rounded-full bg-white transition`}
      />
    </button>
  </div>
));

ToggleSwitch.displayName = 'ToggleSwitch';

// メイン設定フォーム
export default function SettingsForm() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailUpdates: false,
    language: 'ja',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際のアプリケーションでは、ここで設定を保存する処理を実装
    console.log('Settings saved:', settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <ToggleSwitch
        enabled={settings.darkMode}
        onChange={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
        label="ダークモード"
        description="アプリケーションの表示テーマを切り替えます"
      />

      <ToggleSwitch
        enabled={settings.notifications}
        onChange={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
        label="通知"
        description="システム通知の有効/無効を切り替えます"
      />

      <ToggleSwitch
        enabled={settings.emailUpdates}
        onChange={() => setSettings(prev => ({ ...prev, emailUpdates: !prev.emailUpdates }))}
        label="メールアップデート"
        description="メールでの更新通知を受け取ります"
      />

      <div>
        <label htmlFor="language" className="block text-base font-medium text-slate-200 mb-2">
          言語
        </label>
        <select
          id="language"
          name="language"
          className="w-full bg-slate-700 text-slate-200 rounded-lg px-4 h-10 focus:ring-1 focus:ring-slate-500 border-0"
          value={settings.language}
          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
        >
          <option value="ja" className="bg-slate-800">日本語</option>
          <option value="en" className="bg-slate-800">English</option>
          <option value="zh" className="bg-slate-800">中文</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full h-10 rounded-lg text-white font-medium bg-indigo-500 hover:bg-indigo-600 transition-colors focus:ring-1 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-indigo-500"
        >
          設定を保存
        </button>
      </div>

      <LogoutButton />
    </form>
  );
}
