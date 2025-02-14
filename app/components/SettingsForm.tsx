'use client';

import { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* ダークモード設定 */}
      <div className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          <span className="text-base font-medium text-white">ダークモード</span>
          <span className="text-sm text-white/60">
            アプリケーションの表示テーマを切り替えます
          </span>
        </span>
        <button
          type="button"
          className={`${
            settings.darkMode ? 'bg-indigo-500' : 'bg-white/20'
          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
          onClick={() =>
            setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
          }
        >
          <span
            className={`${
              settings.darkMode ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </button>
      </div>

      {/* 通知設定 */}
      <div className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          <span className="text-base font-medium text-white">通知</span>
          <span className="text-sm text-white/60">
            システム通知の有効/無効を切り替えます
          </span>
        </span>
        <button
          type="button"
          className={`${
            settings.notifications ? 'bg-indigo-500' : 'bg-white/20'
          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
          onClick={() =>
            setSettings((prev) => ({
              ...prev,
              notifications: !prev.notifications,
            }))
          }
        >
          <span
            className={`${
              settings.notifications ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </button>
      </div>

      {/* メールアップデート設定 */}
      <div className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          <span className="text-base font-medium text-white">
            メールアップデート
          </span>
          <span className="text-sm text-white/60">
            メールでの更新通知を受け取ります
          </span>
        </span>
        <button
          type="button"
          className={`${
            settings.emailUpdates ? 'bg-indigo-500' : 'bg-white/20'
          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
          onClick={() =>
            setSettings((prev) => ({
              ...prev,
              emailUpdates: !prev.emailUpdates,
            }))
          }
        >
          <span
            className={`${
              settings.emailUpdates ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </button>
      </div>

      {/* 言語設定 */}
      <div>
        <label htmlFor="language" className="block text-base font-medium text-white mb-2">
          言語
        </label>
        <select
          id="language"
          name="language"
          className="w-full appearance-none bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={settings.language}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, language: e.target.value }))
          }
        >
          <option value="ja" className="bg-gray-800">日本語</option>
          <option value="en" className="bg-gray-800">English</option>
          <option value="zh" className="bg-gray-800">中文</option>
        </select>
      </div>

      {/* 保存ボタン */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 rounded-lg text-white text-lg font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          設定を保存
        </button>
      </div>
    </form>
  );
}
