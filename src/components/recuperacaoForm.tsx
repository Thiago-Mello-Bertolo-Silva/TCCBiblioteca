// src/components/RecuperacaoForm.tsx
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
    <div className='flex flex-col items-start gap-[1rem] bg-gray-100 text-black w-[24em] p-[1em_2em] rounded-md shadow-md'>
      <label className='text-[2em]'>Recuperar Senha</label>

      <p className="text-sm text-gray-600">
        Para recuperar o acesso à sua conta, informe seu e-mail abaixo. Enviaremos um link com instruções para redefinir sua senha.
      </p>

      {mensagem && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
          {mensagem}
        </div>
      )}

      <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-1'>
          <div className='flex gap-2 items-center bg-white px-3 py-2 rounded'>
            <MdOutlineEmail />
            <input
              ref={emailRef}
              type='email'
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white border-none text-black w-full focus:outline-none'
            />
          </div>
          {erroEmail && <p className='text-red-500 text-xs'>{erroEmail}</p>}
        </div>

        <button
          type='submit'
          className='w-full h-[3em] rounded-md text-white bg-blue-900 cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-800 hover:shadow-lg hover:scale-105'
        >
          Enviar recuperação
        </button>
      </form>

      <div className="text-sm text-gray-600 mt-2 w-full text-center">
        Lembrou sua senha?{' '}
        <a href="/" className="text-blue-700 hover:underline">
          Faça login
        </a>
      </div>
    </div>
  );
}
