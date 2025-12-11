'use client'

import { UserSettings } from '@/types'

interface SettingsPanelProps {
  settings: UserSettings
  onToggle: (key: keyof UserSettings) => void
}

export const settingItems = [
  {
    key: 'emailNotifications' as keyof UserSettings,
    title: 'Email Notifications',
    description: 'Receive notifications via email',
  },
  {
    key: 'pushNotifications' as keyof UserSettings,
    title: 'Push Notifications',
    description: 'Receive push notifications in browser',
  },
  {
    key: 'smsNotifications' as keyof UserSettings,
    title: 'SMS Notifications',
    description: 'Receive notifications via SMS',
  },
  {
    key: 'newMessageNotifications' as keyof UserSettings,
    title: 'New Messages',
    description: 'Notifications about new messages',
  },
  {
    key: 'priceChangeNotifications' as keyof UserSettings,
    title: 'Price Changes',
    description: 'Notifications about price changes in favorites',
  },
]

export default function SettingsPanel({
  settings,
  onToggle,
}: SettingsPanelProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Notification Settings
      </h2>
      <div className="space-y-4">
        {settingItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key] ?? false}
                onChange={() => onToggle(item.key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
