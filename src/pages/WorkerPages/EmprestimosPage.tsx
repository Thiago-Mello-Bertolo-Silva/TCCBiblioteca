import { useEffect, useState } from "react";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { useEmprestimosColumns } from "@/hooks/useEmprestimosColumns";
import { DataTableEmprestimos } from "@/components/data-table-emprestimos";

export default function EmprestimosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const columns = useEmprestimosColumns();

  // Agora a função é pública e pode ser passada como prop
  const onRefreshEmprestimos = async () => {
    try {
      const response = await fetch("http://localhost:3000/emprestimos");
      const data = await response.json();
      setEmprestimos(data);
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
    }
  };

  useEffect(() => {
    onRefreshEmprestimos(); // chama ao montar a página
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Empréstimos</h1>
      </div>
      <DataTableEmprestimos 
        data={emprestimos} 
        columns={columns} 
        onRefresh={onRefreshEmprestimos} // <-- passando a função para o DataTable
      />
    </div>
  );
}
