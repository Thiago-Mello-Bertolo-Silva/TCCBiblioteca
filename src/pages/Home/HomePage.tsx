import { Suspense, useEffect, useState, lazy } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";

const AreaChartLivros = lazy(() =>
  import("@/components/dashboard/AreaChartLivros").then((module) => ({
    default: module.AreaChartLivros,
  }))
);

interface BibliotecaMetrics {
  totalLivros: number;
  totalUsuarios: number;
  livrosEmprestados: number;
}

export function HomePage() {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<BibliotecaMetrics>({
    totalLivros: 0,
    totalUsuarios: 0,
    livrosEmprestados: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const response = await fetch("http://localhost:3000/dashboard-metrics");
        if (!response.ok) throw new Error("Erro ao buscar métricas");
        const data: BibliotecaMetrics = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

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
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-8">
      {isLoading ? (
        <div className="text-center text-lg text-green-800 animate-pulse">
          Carregando dados da biblioteca...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <Card className="border border-green-600 shadow-lg rounded-lg p-6 hover:scale-105 transition-all">
              <CardHeader>
                <CardDescription className="text-green-700 text-lg">
                  Total de Livros Registrados
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-green-800">
                  {metrics.totalLivros}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-green-600">
                Inclui todos os exemplares da biblioteca
              </CardFooter>
            </Card>

            <Card className="border border-green-600 shadow-lg rounded-lg p-6 hover:scale-105 transition-all">
              <CardHeader>
                <CardDescription className="text-green-700 text-lg">
                  Total de Usuários Registrados
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-green-800">
                  {metrics.totalUsuarios}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-green-600">
                Usuários com conta ativa no sistema
              </CardFooter>
            </Card>

            <Card className="border border-green-600 shadow-lg rounded-lg p-6 hover:scale-105 transition-all">
              <CardHeader>
                <CardDescription className="text-green-700 text-lg">
                  Livros Emprestados no Momento
                </CardDescription>
                <CardTitle className="text-4xl font-bold text-green-800">
                  {metrics.livrosEmprestados}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-green-600">
                Empréstimos em andamento
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 w-full">
            <Suspense fallback={<div className="text-green-800 text-lg">Carregando gráfico...</div>}>
              <AreaChartLivros />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
