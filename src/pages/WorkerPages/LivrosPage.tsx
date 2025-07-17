// src/pages/LivrosPage.tsx
import { useEffect, useState } from "react";
import { Livro } from "@/hooks/useLivrosColumns";
import { DataTableLivros } from "@/components/data-table-livros";

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([]);

  const fetchLivros = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livros`);
      const data = await response.json();
      setLivros(data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  return (
    <div className="container overflow-auto mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Coleção de livros</h1>
      </div>
      <DataTableLivros data={livros} onRefreshLivros={fetchLivros} />
    </div>
  );
}
