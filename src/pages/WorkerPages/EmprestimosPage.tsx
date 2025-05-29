import { useEffect, useState } from "react";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { DataTableEmprestimos } from "@/components/data-table-emprestimos";

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const fetchEmprestimos = async () => {
    try {
      const response = await fetch("http://localhost:3000/emprestimos");
      const data = await response.json();

console.log(data);

      // Mapeando os dados para incluir nome do usuário e título do livro
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
    fetchEmprestimos(); // chama ao montar a página
  }, []);

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
