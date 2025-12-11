export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Разрешены только изображения: JPG, PNG, WebP',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Размер файла не должен превышать 5MB',
    }
  }

  return { valid: true }
}

export function createImagePreview(file: File): Promise<string> {
  return fileToBase64(file)
}
