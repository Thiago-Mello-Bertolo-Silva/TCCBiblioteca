import { Suspense, lazy } from "react";
import { QueryErrorResetBoundary, } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { useTotalEmprestimosAtivosQuery, useTotalLivrosQuery, useTotalUsuariosQuery, } from "@/hooks/useDashboardMetricsQuery";

const AreaChartLivros = lazy(() =>
  import("@/components/dashboard/AreaChartLivros").then((module) => ({
    default: module.AreaChartLivros,
  }))
);

// Card de erro reutilizável com botão "Tentar novamente"
function ErrorCard({
  title,
  reset,
}: {
  title: string;
  reset: () => void;
}) {
  return (
    <Card className="border border-red-600 p-6 bg-red-100">
      <CardHeader>
        <CardTitle className="text-red-600 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between items-center w-full">
        <span className="text-sm text-red-600">Tente novamente mais tarde.</span>
        <Button variant="outline" onClick={reset}>
          atualizar
        </Button>
      </CardFooter>
    </Card>
  );
}

// Componente do card de Total de Livros
function TotalLivrosCard() {
  const { data } = useTotalLivrosQuery();
  return (
    <Card className="border border-blue-600 shadow-lg rounded-lg p-6">
      <CardHeader>
        <CardDescription className="text-blue-400 text-lg">
          Total de Livros Registrados
        </CardDescription>
        <CardTitle className="text-4xl font-bold text-blue-400">{data}</CardTitle>
      </CardHeader>
      <CardFooter className="text-sm text-blue-400">
        Inclui todos os exemplares da biblioteca
      </CardFooter>
    </Card>
  );
}

// Componente do card de Total de Usuários
function TotalUsuariosCard() {
  const { data } = useTotalUsuariosQuery();
  return (
    <Card className="border border-blue-600 shadow-lg rounded-lg p-6">
      <CardHeader>
        <CardDescription className="text-blue-400 text-lg">
          Total de Usuários Registrados
        </CardDescription>
        <CardTitle className="text-4xl font-bold text-blue-400">{data}</CardTitle>
      </CardHeader>
      <CardFooter className="text-sm text-blue-400">
        Usuários com conta ativa no sistema
      </CardFooter>
    </Card>
  );
}

// Componente do card de Total de Emprestimos
function TotalEmprestimosCard() {
  const { data } = useTotalEmprestimosAtivosQuery();
  return (
    <Card className="border border-blue-600 shadow-lg rounded-lg p-6">
      <CardHeader>
        <CardDescription className="text-blue-400 text-lg">
          Livros Emprestados no Momento
        </CardDescription>
        <CardTitle className="text-4xl font-bold text-blue-400">{data}</CardTitle>
      </CardHeader>
      <CardFooter className="text-sm text-blue-400">
        Empréstimos ainda não concluídos
      </CardFooter>
    </Card>
  );
}

// Página principal
export function HomePage() {
  const { user } = useAuth();

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* Card: Total de Livros */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <ErrorCard title="Erro ao carregar total de livros" reset={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<div className="text-blue-800 animate-pulse">Carregando livros...</div>}>
                <TotalLivrosCard />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>

        {/* Card: Total de Usuários */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <ErrorCard title="Erro ao carregar total de usuários" reset={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<div className="text-blue-800 animate-pulse">Carregando usuários...</div>}>
                <TotalUsuariosCard />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>

        {/* Card: Total de Empréstimos Ativos */}
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <ErrorCard title="Erro ao carregar empréstimos" reset={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<div className="text-blue-800 animate-pulse">Carregando empréstimos...</div>}>
                <TotalEmprestimosCard />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>

      </div>

      {/* Gráfico */}
      <div className="mt-12 w-full">
        <Suspense fallback={<div className="text-blue-800 text-lg">Carregando gráfico...</div>}>
          <AreaChartLivros />
        </Suspense>
      </div>
    </div>
  );
}
