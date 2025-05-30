import { useState, useRef, FormEvent } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function RecuperacaoForm() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const emailRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErroEmail('');
    setMensagem('');

    if (!email) {
      setErroEmail('*E-mail deve ser preenchido!');
      emailRef.current?.focus();
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/esqueci-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(data.message || 'Confira seu e-mail para redefinir sua senha.');
        setTimeout(() => {
          navigate('/', {
            state: {
              message: 'Confira seu e-mail para redefinir sua senha.'
            }
          });
        }, 4000);
      } else {
        setErroEmail(data.error || 'Erro ao enviar e-mail de recuperação.');
      }
    } catch (error) {
      setErroEmail('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-green-200 p-8 rounded-lg shadow-2xl border border-green-600">
      <h2 className="text-3xl font-bold text-green-800">Recuperar Senha</h2>

      <p className="text-sm text-green-800 text-center">
        Para recuperar o acesso à sua conta, informe seu e-mail abaixo. Enviaremos um link com instruções para redefinir sua senha.
      </p>

      {mensagem && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
          {mensagem}
        </div>
      )}

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg">
          <MdOutlineEmail className="text-white" />
          <input
            ref={emailRef}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
          />
        </div>
        {erroEmail && <p className="text-red-400 text-sm">{erroEmail}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-md"
        >
          Enviar recuperação
        </button>
      </form>

      <div className="text-sm text-black mt-2 w-full text-center">
        Lembrou sua senha?{' '}
        <a href="/" className="text-blue-700 hover:underline">Faça login</a>
      </div>
    </div>
  );
}
