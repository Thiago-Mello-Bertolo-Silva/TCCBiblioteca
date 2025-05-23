import { useState, FormEvent, useRef } from 'react';
import { CiLock } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/authContext'; // 👈 Importa o hook de autenticação
import { jwtDecode } from 'jwt-decode'; // 👈 Para decodificar o token

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const inputLgnRef = useRef<HTMLInputElement | null>(null);
  const inputPswdRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 👈 Para atualizar o contexto após login

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
        body: JSON.stringify({
          login: email,
          password: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordError('Credenciais inválidas. Verifique e-mail e senha.');
        } else {
          setPasswordError('Erro ao tentar logar. Tente novamente.');
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      // 👇 Decodifica e atualiza o contexto
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);

      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      setPasswordError('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div className='flex flex-col items-start gap-[1rem] bg-gray-100 text-black w-[24em] p-[1em_2em_1em_2em] rounded-md shadow-md'>
      <label className='text-[2em]'>Login</label>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-[1.5em] w-full'>
          <div className='flex gap-2 items-center bg-white px-3 py-2 rounded'>
            <FaRegCircleUser />
            <input
              ref={inputLgnRef}
              type='text'
              placeholder='E-mail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='bg-white border-none text-black w-full focus:outline-none'
            />
          </div>
          {emailError && <p className='text-red-500 text-xs'>{emailError}</p>}

          <div className='flex gap-2 items-center bg-white px-3 py-2 rounded'>
            <CiLock />
            <input
              ref={inputPswdRef}
              type='password'
              placeholder='Senha'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='bg-white border-none text-black w-full focus:outline-none'
            />
          </div>
          {passwordError && <p className='text-red-500 text-xs'>{passwordError}</p>}

          <button
            className='w-full h-[3em] rounded-md text-white bg-[#00031f] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#1a1d50] hover:shadow-lg hover:scale-105'
            type='submit'
          >
            Log in
          </button>
        </div>
      </form>

      <a href="/Cadastrar" className='w-full'>
        <button
          type="button"
          className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-500 transition"
        >
          Cadastrar
        </button>
      </a>

      <div className="text-sm text-gray-600 mt-2 w-full text-center">
        Esqueceu sua senha?{' '}
        <a href="/Recuperacao" className="text-blue-700 hover:underline">
          Clique aqui para recuperar
        </a>
      </div>
    </div>
  );
}
