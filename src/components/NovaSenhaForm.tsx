import { useState, FormEvent, useRef } from 'react';
import { MdLock } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';

export default function NovaSenhaForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const senhaRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      senhaRef.current?.focus();
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/nova-senha/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(data.message || 'Senha redefinida com sucesso!');
        setTimeout(() => {
          navigate('/', {
            state: {
              message: 'Senha redefinida com sucesso! Faça login.'
            }
          });
        }, 4000);
      } else {
        setErro(data.message || 'Erro ao redefinir senha.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-green-200 p-8 rounded-lg shadow-2xl border border-green-600">
      <h2 className="text-3xl font-bold text-green-800">Redefinir Senha</h2>

      <p className="text-sm text-green-800 text-center">
        Insira sua nova senha e confirme abaixo para atualizar seu acesso.
      </p>

      {mensagem && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="w-full bg-red-100 border border-red-600 text-red-600 px-4 py-2 rounded text-sm text-center">
          {erro}
        </div>
      )}

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg">
          <MdLock className="text-white" />
          <input
            ref={senhaRef}
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
            required
          />
        </div>

        <div className="relative flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg">
          <MdLock className="text-white" />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-md"
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
}
