// src/pages/UsuariosPage.tsx
import { useEffect, useState } from "react";
import { Usuario } from "@/hooks/useUsuariosColumns";
import { DataTableUsuarios } from "@/components/data-table-usuarios";
import { useAuth } from "@/contexts/authContext";

export default function UsuariosPage() {
  const { user } = useAuth();
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

  // 🔒 Proteção: apenas admin pode acessar
  if (user?.cargo !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-3xl font-bold text-red-600">Acesso negado</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Você não tem permissão para visualizar esta página. Apenas administradores podem acessar.
        </p>
      </div>
    );
  }

  return (
    <div className="container overflow-auto mx-auto py-10">
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
