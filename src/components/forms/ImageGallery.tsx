'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
} from 'react-icons/fa'
import Modal from '../ui/Modal'

interface ImageGalleryProps {
  images: string[]
  title?: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!images || images.length === 0) return null

  const mainImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasMultipleImages) {
        e.preventDefault()
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        e.preventDefault()
        setCurrentIndex((prev) => (prev + 1) % images.length)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setIsLightboxOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, hasMultipleImages, images.length])

  return (
    <>
      <div className="relative">
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 group">
          <Image
            src={mainImage}
            alt={title || 'Изображение'}
            fill
            className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsLightboxOpen(true)}
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <FaExpand />
          </button>

          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <FaChevronRight />
              </button>
            </>
          )}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {hasMultipleImages && images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-orange-500 ring-2 ring-orange-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${title || 'Изображение'} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        size="xl"
        showCloseButton={true}
      >
        <div className="relative">
          <div className="relative w-full h-[70vh] bg-black rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={title || 'Изображение'}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-opacity"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-opacity"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black bg-opacity-50 text-white text-sm rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {hasMultipleImages && images.length > 1 && (
            <div className="mt-4 flex gap-2 justify-center overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title || 'Изображение'} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
