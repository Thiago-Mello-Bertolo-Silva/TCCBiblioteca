import { Suspense, useEffect, useState, lazy } from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/authContext" // 👈 Importa o contexto

const AreaChartLivros = lazy(() =>
  import("@/components/dashboard/AreaChartLivros").then((module) => ({
    default: module.AreaChartLivros,
  }))
)

interface BibliotecaMetrics {
  totalLivros: number
  totalUsuarios: number
  livrosEmprestados: number
}

export function HomePage() {
  const { user } = useAuth() // 👈 Pega o usuário logado

  const [metrics, setMetrics] = useState<BibliotecaMetrics>({
    totalLivros: 0,
    totalUsuarios: 0,
    livrosEmprestados: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const response = await fetch("http://localhost:3000/dashboard-metrics")
        if (!response.ok) throw new Error("Erro ao buscar métricas")
        const data: BibliotecaMetrics = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Erro ao buscar métricas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  // ✅ Verifica se o usuário é admin
  if (user?.cargo !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Acesso negado</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Você não tem permissão para visualizar esta página. Apenas administradores podem acessar.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {isLoading ? (
        <div className="text-center text-muted-foreground text-sm">
          Carregando dados da biblioteca...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total de Livros Registrados</CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  {metrics.totalLivros}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                Inclui todos os exemplares da biblioteca
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total de Usuários Registrados</CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  {metrics.totalUsuarios}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                Usuários com conta ativa no sistema
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Livros Emprestados no Momento</CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  {metrics.livrosEmprestados}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                Empréstimos em andamento
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Suspense fallback={<div>Carregando gráfico...</div>}>
              <AreaChartLivros />
            </Suspense>
          </div>
        </>
      )}
    </div>
  )
}
