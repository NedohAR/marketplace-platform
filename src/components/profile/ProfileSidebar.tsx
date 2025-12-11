'use client'

import { User } from '@/types'
import { FaUser, FaList, FaCog, FaHistory, FaSignOutAlt } from 'react-icons/fa'

type Tab = 'profile' | 'ads' | 'settings' | 'activity'

interface ProfileSidebarProps {
  user: User
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onLogout: () => void
}

const tabs = [
  { id: 'profile' as Tab, label: 'Profile', icon: FaUser },
  { id: 'ads' as Tab, label: 'My Ads', icon: FaList },
  { id: 'activity' as Tab, label: 'Activity', icon: FaHistory },
  { id: 'settings' as Tab, label: 'Settings', icon: FaCog },
]

export default function ProfileSidebar({
  user,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
          {user.name[0].toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      <button
        onClick={onLogout}
        className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <FaSignOutAlt />
        <span>Sign Out</span>
      </button>
    </div>
  )
}
