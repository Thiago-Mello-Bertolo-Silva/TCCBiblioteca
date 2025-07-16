// src/pages/MeusLivrosPage.tsx
import { useEffect, useState } from 'react';

type Emprestimo = {
  id: number;
  livro: {
    titulo: string;
  };
  dataInicio: string;
  dataPrevistoDevolucao: string;
};

export default function MeusLivrosPage() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('token'); 

  if (token) {
    fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/meus-emprestimos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setEmprestimos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar empréstimos do usuário:', err);
        setLoading(false);
      });
  }
}, []);


  if (loading) {
    return <p className="text-center mt-10">Carregando seus livros emprestados...</p>;
  }

  if (emprestimos.length === 0) {
    return <p className="text-center mt-10">Você ainda não possui livros emprestados.</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Meus Livros</h1>
      <ul className="space-y-4">
        {emprestimos.map((e) => (
          <li key={e.id} className="bg-white shadow rounded-lg p-4 border">
            <h2 className="text-xl font-semibold text-blue-800">{e.livro.titulo}</h2>
            <p>📅 Emprestado em: {new Date(e.dataInicio).toLocaleDateString()}</p>
            <p>📚 Devolver até: {new Date(e.dataPrevistoDevolucao).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
