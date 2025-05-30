import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface LivroPorMes {
  mes: string;
  livros: number;
}

export function AreaChartLivros() {
  const [data, setData] = useState<LivroPorMes[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/livros-por-mes");
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="w-full h-[350px] bg-transparent border border-green-600 shadow-lg rounded-lg p-4">
      <CardContent className="h-full p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Livros Cadastrados por Mês
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="mes" tick={{ fill: "#165a34", fontSize: 14 }} />
            <YAxis tick={{ fill: "#165a34", fontSize: 14 }} />
            <Tooltip
              wrapperStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "6px" }}
              contentStyle={{ border: "none", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="livros"
              stroke="#2d8659"
              fill="url(#colorLivros)"
              strokeWidth={3}
              animationDuration={800}
            />
            <defs>
              <linearGradient id="colorLivros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2d8659" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2d8659" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
