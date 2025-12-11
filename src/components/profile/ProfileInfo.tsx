'use client'

import { useState } from 'react'
import { User } from '@/types'
import { FaEdit } from 'react-icons/fa'
import FormInput from '../forms/FormInput'

interface ProfileInfoProps {
  user: User
  onSave: (data: {
    name: string
    email: string
    phone: string
    location: string
  }) => void
}

export default function ProfileInfo({ user, onSave }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    location: user.location || '',
  })

  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaEdit />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <FormInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon="user"
          />
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            icon="email"
          />
          <FormInput
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1234567890"
            icon="phone"
          />
          <FormInput
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="New York"
            icon="location"
          />
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold">{user.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Phone:</span>
            <span className="font-semibold">
              {user.phone || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Location:</span>
            <span className="font-semibold">
              {user.location || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Registration Date:</span>
            <span className="font-semibold">
              {new Date(user.createdAt).toLocaleDateString('en-US')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
