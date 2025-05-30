// components/config/UploadFotoPerfil.tsx
import React, { useState } from 'react';

interface UploadFotoPerfilProps {
  userId: number;
  fotoAtual?: string;
  onUploadSuccess?: (novaUrl: string) => void;
}

export function UploadFotoPerfil({ userId, fotoAtual, onUploadSuccess }: UploadFotoPerfilProps) {
  const [preview, setPreview] = useState(fotoAtual || '');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('fotoPerfil', file);

    try {
      setUploading(true);
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/api/usuario/foto/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setPreview(data.fotoPerfil);
        onUploadSuccess?.(data.fotoPerfil);
        alert('Foto de perfil atualizada com sucesso!');
      } else {
        alert(data.error || 'Erro ao atualizar a foto.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {preview && (
        <img
          src={`${import.meta.env.VITE_PUBLIC_BACKENDURL}/${preview}`}
          alt="Foto de Perfil"
          className="w-32 h-32 rounded-full object-cover border"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm"
        disabled={uploading}
      />
      {uploading && <p>Enviando imagem...</p>}
    </div>
  );
}
