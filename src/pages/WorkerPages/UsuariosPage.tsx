// src/pages/UsuariosPage.tsx
import { useEffect, useState } from "react";
import { Usuario } from "@/hooks/useUsuariosColumns";
import { DataTableUsuarios } from "@/components/data-table-usuarios";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);


  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuários Registrados</h1>
      </div>
      <DataTableUsuarios 
        data={usuarios} 
        onRefreshUsuarios={fetchUsuarios} 
      />
    </div>
  );
}
