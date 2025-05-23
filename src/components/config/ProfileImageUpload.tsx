import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface ProfileImageUploadProps {
  userId: number;
  onUploadSuccess?: () => void;
}

export default function ProfileImageUpload({ userId, onUploadSuccess }: ProfileImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('imagemPerfil', selectedImage);

    try {
      setIsUploading(true);
      await axios.post(
        `http://localhost:3001/usuarios/${userId}/upload-foto`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Pré-visualização"
          className="w-32 h-32 rounded-full object-cover border shadow"
        />
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <Button onClick={handleUpload} disabled={!selectedImage || isUploading}>
        {isUploading ? 'Enviando...' : 'Salvar'}
      </Button>
    </div>
  );
}
