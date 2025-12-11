'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { FaUpload, FaTimes, FaImage } from 'react-icons/fa'
import { fileToBase64, validateImageFile } from '@/utils/imageUtils'

interface ImageUploadProps {
  value: string
  onChange: (imageUrl: string) => void
  label?: string
  required?: boolean
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError('')
      setIsUploading(true)

      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || 'File validation error')
        setIsUploading(false)
        return
      }

      try {
        const base64 = await fileToBase64(file)
        setPreview(base64)
        onChange(base64)
      } catch (err) {
        setError('Error uploading image')
        console.error(err)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      await processFile(file)
    } else {
      setError('Please drop an image file')
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>

      {preview ? (
        <div className="relative">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 100%"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div
          ref={dropZoneRef}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-orange-500 bg-orange-100'
              : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaUpload className="text-2xl text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragging
                    ? 'Drop image here'
                    : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Or paste image URL
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={value && !value.startsWith('data:') ? value : ''}
              onChange={(e) => {
                const url = e.target.value
                if (url) {
                  setPreview(url)
                  onChange(url)
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
