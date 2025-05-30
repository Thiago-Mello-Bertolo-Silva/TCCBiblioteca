import { useState, FormEvent, useRef } from 'react';
import { CiLock } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/authContext';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/contexts/authContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const inputLgnRef = useRef<HTMLInputElement | null>(null);
  const inputPswdRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!email) {
      setEmailError('*Email deve ser preenchido!');
      inputLgnRef.current?.focus();
      return;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('*Senha deve ser preenchida!');
      inputPswdRef.current?.focus();
      return;
    } else {
      setPasswordError('');
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: email, password: password }),
      });

      if (!response.ok) {
        setPasswordError(response.status === 401 ? 'Credenciais inválidas. Verifique e-mail e senha.' : 'Erro ao tentar logar. Tente novamente.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      const decodedUser = jwtDecode<User>(data.token);
      setUser(decodedUser); 
      navigate('/Welcome');
    } catch (error) {
      console.error('Erro no login:', error);
      setPasswordError('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-green-200 p-8 rounded-lg shadow-2xl border border-green-600">
      <h2 className="text-3xl font-bold text-green-900">Acesse sua conta</h2>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg">
          <FaRegCircleUser className="text-green-900" />
          <input
            ref={inputLgnRef}
            type="text"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-transparent border-none text-green-900 w-full placeholder-green-900 focus:outline-none"
          />
        </div>
        {emailError && <p className="text-red-600 text-sm">{emailError}</p>}

        <div className="relative flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg">
          <CiLock className="text-green-900" />
          <input
            ref={inputPswdRef}
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="bg-transparent border-none text-green-900 w-full placeholder-green-900 focus:outline-none"
          />
        </div>
        {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}

        <button
          className="w-full py-3 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-md"
          type="submit"
        >
          Entrar
        </button>
      </form>

      <a href="/Cadastrar" className="w-full">
        <button className="w-full py-3 mt-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-900 hover:scale-105 transition">
          Criar conta
        </button>
      </a>

      <div className="text-sm text-green-900 mt-2 w-full text-center">
        Esqueceu sua senha?{' '}
        <a href="/Recuperacao" className="text-blue-700 hover:underline">
          Clique aqui para recuperar
        </a>
      </div>
    </div>
  );
}
