import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/authContext"

interface Notificacao {
  id: number
  mensagem: string
  data: string
}

export function NotificacoesPage() {
  const { user } = useAuth()
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    async function fetchNotificacoes() {
      try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/notificacoes/${user?.id}`)
        const data = await response.json()
        setNotificacoes(data)
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
      }
    }

    fetchNotificacoes()
  }, [user?.id])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Suas Notificações</h1>

      <div className="grid gap-4">
        {notificacoes.length === 0 && (
          <p className="text-gray-500">Nenhuma notificação no momento.</p>
        )}

        {notificacoes.map((notificacao) => (
          <Card key={notificacao.id} className="border border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-600">Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{notificacao.mensagem}</p>
              <p className="text-sm text-gray-500 mt-2">Data: {new Date(notificacao.data).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
