'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { FaUpload, FaTimes, FaImage } from 'react-icons/fa'
import { fileToBase64, validateImageFile } from '@/utils/imageUtils'

interface MultipleImageUploadProps {
  value: string[]
  onChange: (images: string[]) => void
  label?: string
  required?: boolean
  maxImages?: number
}

export default function MultipleImageUpload({
  value = [],
  onChange,
  label = 'Images',
  required = false,
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const processFiles = useCallback(
    async (files: File[]) => {
      setError('')

      if (previews.length + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      setIsUploading(true)

      try {
        const validFiles: File[] = []
        for (const file of files) {
          const validation = validateImageFile(file)
          if (validation.valid) {
            validFiles.push(file)
          } else {
            setError(validation.error || 'Some files are invalid')
          }
        }

        if (validFiles.length === 0) {
          setIsUploading(false)
          return
        }

        const base64Promises = validFiles.map((file) => fileToBase64(file))
        const newImages = await Promise.all(base64Promises)
        const updatedImages = [...previews, ...newImages]
        setPreviews(updatedImages)
        onChange(updatedImages)
      } catch (err) {
        setError('Error uploading images')
        console.error(err)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, previews, maxImages]
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    await processFiles(files)
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

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    if (files.length > 0) {
      await processFiles(files)
    } else {
      setError('Please drop image files')
    }
  }

  const handleRemove = (index: number) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onChange(updated)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const canAddMore = previews.length < maxImages

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
        {previews.length > 0 && (
          <span className="text-gray-500 font-normal ml-2">
            ({previews.length}/{maxImages})
          </span>
        )}
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FaTimes className="text-xs" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          ref={dropZoneRef}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
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
            multiple
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
                    ? 'Drop images here'
                    : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP up to 5MB each
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {!canAddMore && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum {maxImages} images reached. Remove some to add more.
        </p>
      )}
    </div>
  )
}
