// src/pages/LoadUserPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

export default function LoadUserPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const carregarUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const resposta = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/eu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os dados do usuário.');
        }

        const usuario = await resposta.json();
        setUser(usuario);
        navigate('/welcome');
      } catch (erro) {
        console.error(erro);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    carregarUsuario();
  }, [navigate, setUser]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-blue-800 text-lg font-medium">Carregando informações do usuário...</p>
    </div>
  );
}
