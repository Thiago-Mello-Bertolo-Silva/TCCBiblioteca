import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts'
  import { Card, CardContent } from '@/components/ui/card'
  import { useEffect, useState } from 'react'
  
  interface LivroPorMes {
    mes: string
    livros: number
  }
  
  export function AreaChartLivros() {
    const [data, setData] = useState<LivroPorMes[]>([])
  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch('http://localhost:3000/livros-por-mes')
          if (!response.ok) throw new Error('Erro ao buscar dados')
          const result = await response.json()
          setData(result)
        } catch (error) {
          console.error('Erro ao carregar dados do gráfico:', error)
        }
      }
  
      fetchData()
    }, [])
  
    return (
      <Card className="w-full h-[300px]">
        <CardContent className="h-full p-6">
          <h2 className="text-lg font-semibold mb-4">Livros Cadastrados por Mês</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="livros"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }
  