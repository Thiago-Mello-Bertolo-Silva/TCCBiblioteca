import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataItem {
  categoria: string;
  quantidade: number;
}

export function AreaChartLivros() {
  const [data, setData] = useState<DataItem[]>([]);
  const [filtro, setFiltro] = useState<"editora" | "autores">("editora");

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${import.meta.env.VITE_PUBLIC_BACKENDURL}/livros-por-${filtro}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const result = await response.json();
        // padroniza para { categoria, quantidade }
        const formatted = result.map((item: any) => ({
          categoria: item[filtro],
          quantidade: Number(item.quantidade),
        }));
        setData(formatted);
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      }
    }

    fetchData();
  }, [filtro]);

  return (
    <Card className="w-full h-[400px] bg-transparent border border-blue-400 shadow-lg rounded-lg p-4">
      <CardContent className="h-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Livros por {filtro === "editora" ? "Editora" : "autores"}</h2>
          <Select value={filtro} onValueChange={(value) => setFiltro(value as "editora" | "autores")}>
            <SelectTrigger className="w-[180px] border-blue-500 shadow-sm focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editora">Por Editora</SelectItem>
              <SelectItem value="autores">Por Autores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="categoria" tick={{ fill: "#165a34", fontSize: 14 }} />
            <YAxis tick={{ fill: "#165a34", fontSize: 14 }} allowDecimals={false} />
            <Tooltip
              wrapperStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "6px" }}
              contentStyle={{ border: "none", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="quantidade"
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
