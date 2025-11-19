// src/hooks/useNotificacoes.ts
import { useQuery } from "@tanstack/react-query"

export function useNotificacoes(idUsuario: number) {
  return useQuery({
    queryKey: ["notificacoes", idUsuario],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/notificacoes/${idUsuario}`)
      if (!res.ok) throw new Error("Erro ao buscar notificações")
      return res.json()
    },
    refetchInterval: 5 * 60 * 1000, // Recarrega a cada 5 minutos
  })
}
