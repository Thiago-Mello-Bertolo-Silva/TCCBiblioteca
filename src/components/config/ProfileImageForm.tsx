import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const ProfileImageForm = () => {
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Imagem de Perfil</Label>

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 rounded-full object-cover border"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 border">
          Sem imagem
        </div>
      )}

      <div>
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <Label htmlFor="profile-image">
          <Button variant="outline">Escolher imagem</Button>
        </Label>
      </div>
    </div>
  )
}
