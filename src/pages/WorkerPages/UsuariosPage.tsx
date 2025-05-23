// src/pages/UsuariosPage.tsx
import { useEffect, useState } from "react";
import { Usuario } from "@/hooks/useUsuariosColumns";
import { useUsuariosColumns } from "@/hooks/useUsuariosColumns";
import { DataTableUsuarios } from "@/components/data-table-usuarios";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedRows, setSelectedRows] = useState<Usuario[]>([]);
  const columns = useUsuariosColumns();

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios");
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
        onSelectedRowsChange={setSelectedRows} 
        onRefreshUsuarios={fetchUsuarios} 
      />
    </div>
  );
}
