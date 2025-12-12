'use client'

import Header from '@/components/layout/Header'
import BackButton from '@/components/layout/BackButton'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdStore } from '@/store/useAdStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMounted } from '@/hooks/useMounted'
import dynamic from 'next/dynamic'

const ProfileSidebar = dynamic(
  () => import('@/components/profile/ProfileSidebar'),
  { ssr: true }
)
const ProfileInfo = dynamic(() => import('@/components/profile/ProfileInfo'), {
  ssr: true,
})
const AdStats = dynamic(() => import('@/components/profile/AdStats'), {
  ssr: true,
})
const UserAdsList = dynamic(() => import('@/components/profile/UserAdsList'), {
  ssr: true,
})
const SettingsPanel = dynamic(
  () => import('@/components/profile/SettingsPanel'),
  { ssr: true }
)
const ActivityHistory = dynamic(
  () => import('@/components/profile/ActivityHistory'),
  { ssr: true }
)
import Link from 'next/link'
import PageLoader from '@/components/ui/PageLoader'

type Tab = 'profile' | 'ads' | 'settings' | 'activity'

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const mounted = useMounted()

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, router])

  useEffect(() => {
    if (mounted) {
      const tabParam = searchParams.get('tab')
      if (
        tabParam &&
        ['profile', 'ads', 'settings', 'activity'].includes(tabParam)
      ) {
        setActiveTab(tabParam as Tab)
      }
    }
  }, [mounted, searchParams])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!mounted) {
    return <PageLoader />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 pt-20 sm:pt-24">
        <div className="mb-4 sm:mb-6">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              {activeTab === 'profile' && (
                <ProfileInfo
                  user={user}
                  onSave={(data) => updateProfile(data)}
                />
              )}
              {activeTab === 'ads' && <MyAdsTab userId={user.id} />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'activity' && <ActivityTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function MyAdsTab({ userId }: { userId: string }) {
  const { ads, archiveAd, deleteAd, getSellerStats } = useAdStore()
  const { user, addActivity } = useAuthStore()
  const userAds = ads.filter((ad) => ad.userId === userId)
  const stats = getSellerStats(userId)

  const handleArchive = (adId: string, adTitle: string) => {
    archiveAd(adId)
    if (user) {
      addActivity({
        userId: user.id,
        type: 'ad_archived',
        description: `Archived ad: ${adTitle}`,
        adId,
      })
    }
  }

  const handleDelete = (adId: string, adTitle: string) => {
    deleteAd(adId)
    if (user) {
      addActivity({
        userId: user.id,
        type: 'ad_archived',
        description: `Deleted ad: ${adTitle}`,
        adId,
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Ads</h2>
        <Link
          href="/post-ad"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          prefetch={true}
        >
          + Add Ad
        </Link>
      </div>

      <AdStats stats={stats} />

      <UserAdsList
        ads={userAds}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  )
}

function SettingsTab() {
  const { settings, updateSettings } = useAuthStore()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] }
    setLocalSettings(newSettings)
    updateSettings(newSettings)
  }

  return <SettingsPanel settings={localSettings} onToggle={handleToggle} />
}

function ActivityTab() {
  const { getActivities } = useAuthStore()
  const activities = getActivities()

  return <ActivityHistory activities={activities} />
}
