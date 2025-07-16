import { useEffect, useState } from "react";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { DataTableEmprestimos } from "@/components/data-table-emprestimos";
import { useAuth } from "@/contexts/authContext";

export default function EmprestimosPage() {
  const { user } = useAuth();
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const fetchEmprestimos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/emprestimos`);
      const data = await response.json();

      const emprestimosTratados = data.map((item: any) => ({
        ...item,
        nomeUsuario: item.usuario?.nome || "Desconhecido",
        nomeLivro: item.livro?.titulo || "Desconhecido",
        dataInicio: item.dataInicio,
        dataPrevistoDevolucao: item.dataPrevistoDevolucao,
        status: item.status || "Desconhecido",
      }));

      setEmprestimos(emprestimosTratados);
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
    }
  };

  useEffect(() => {
    fetchEmprestimos();
  }, []);

  // 🔒 Proteção: apenas admin pode acessar
  if (user?.cargo !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <h1 className="text-3xl font-bold text-red-600">Acesso negado</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Você não tem permissão para visualizar esta página. Apenas administradores podem acessar.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Empréstimos</h1>
      </div>
      <DataTableEmprestimos 
        data={emprestimos} 
        onRefreshEmprestimos={fetchEmprestimos} 
      />
    </div>
  );
}
