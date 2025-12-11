'use client'

import { SellerStats } from '@/store/useAdStore'
import { FaEye, FaPhone, FaEnvelope } from 'react-icons/fa'

interface AdStatsProps {
  stats: SellerStats[]
}

export default function AdStats({ stats }: AdStatsProps) {
  if (stats.length === 0) return null

  const totalViews = stats.reduce((sum, stat) => sum + stat.views, 0)
  const totalPhoneClicks = stats.reduce(
    (sum, stat) => sum + stat.phoneClicks,
    0
  )
  const totalMessageClicks = stats.reduce(
    (sum, stat) => sum + stat.messageClicks,
    0
  )

  return (
    <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-500 mb-1">
            {totalViews}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {totalPhoneClicks}
          </div>
          <div className="text-sm text-gray-600">Phone Clicks</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {totalMessageClicks}
          </div>
          <div className="text-sm text-gray-600">Message Clicks</div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Per Ad Statistics</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stats.map((stat) => (
            <div
              key={stat.adId}
              className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  Ad ID: {stat.adId.slice(0, 8)}
                </p>
              </div>
              <div className="flex gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <FaEye className="text-orange-500" />
                  {stat.views}
                </span>
                <span className="flex items-center gap-1">
                  <FaPhone className="text-blue-500" />
                  {stat.phoneClicks}
                </span>
                <span className="flex items-center gap-1">
                  <FaEnvelope className="text-green-500" />
                  {stat.messageClicks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
