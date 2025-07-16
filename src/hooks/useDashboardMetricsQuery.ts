// src/hooks/useDashboardMetricsQuery.ts
import { useSuspenseQuery } from "@tanstack/react-query";

export function useTotalLivrosQuery() {
  return useSuspenseQuery({
    queryKey: ["totalLivros"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/dashboard-metrics`);
      if (!response.ok) throw new Error("Erro ao buscar total de livros");
      const data = await response.json();
      return data.totalLivros;
    },
  });
}

export function useTotalUsuariosQuery() {
  return useSuspenseQuery({
    queryKey: ["totalUsuarios"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/dashboard-metrics`);
      if (!response.ok) throw new Error("Erro ao buscar total de usuários");
      const data = await response.json();
      return data.totalUsuarios;
    },
  });
}


