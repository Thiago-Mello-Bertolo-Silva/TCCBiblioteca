// src/components/NotificacoesCard.tsx
import { AlertCircle, BellRing, Clock } from "lucide-react"

export function NotificacoesCard({ notificacoes }: { notificacoes: { tipo: string, mensagem: string }[] }) {
  if (notificacoes.length === 0) return null

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      {notificacoes.map((noti, idx) => {
        const Icon = noti.tipo === "atraso"
          ? AlertCircle
          : noti.tipo === "alerta"
          ? BellRing
          : Clock

        const color = noti.tipo === "atraso"
          ? "text-red-600"
          : noti.tipo === "alerta"
          ? "text-yellow-600"
          : "text-blue-600"

        return (
          <div
            key={idx}
            className={`flex items-start gap-4 border-l-4 p-4 shadow rounded bg-white border-${color}`}
          >
            <Icon className={`w-5 h-5 mt-1 ${color}`} />
            <div className="text-sm text-gray-800">{noti.mensagem}</div>
          </div>
        )
      })}
    </div>
  )
}
