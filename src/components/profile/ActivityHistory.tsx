'use client'

import { Activity } from '@/types'

interface ActivityHistoryProps {
  activities: Activity[]
}

export default function ActivityHistory({ activities }: ActivityHistoryProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ad_created':
        return '📝'
      case 'ad_updated':
        return '✏️'
      case 'ad_archived':
        return '📦'
      case 'ad_sold':
        return '✅'
      case 'message_received':
        return '💬'
      case 'favorite_added':
        return '❤️'
      default:
        return '📌'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Activity History
      </h2>
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(activity.date).toLocaleString('en-US')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Activity history is empty</p>
        </div>
      )}
    </div>
  )
}
