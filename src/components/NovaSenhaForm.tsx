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
      const response = await fetch(`http://localhost:3000/nova-senha/${token}`, {
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
    <div className="flex flex-col items-start gap-[1rem] bg-gray-100 text-black w-[24em] p-[1em_2em] rounded-md shadow-md">
      <label className="text-[2em]">Nova Senha</label>

      <p className="text-sm text-gray-600">
        Insira sua nova senha e confirme abaixo para atualizar seu acesso.
      </p>

      {mensagem && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
          {erro}
        </div>
      )}

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center bg-white px-3 py-2 rounded">
            <MdLock />
            <input
              ref={senhaRef}
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="bg-white border-none text-black w-full focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center bg-white px-3 py-2 rounded">
            <MdLock />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-white border-none text-black w-full focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-[3em] rounded-md text-white bg-blue-900 cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:scale-105"
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
}
