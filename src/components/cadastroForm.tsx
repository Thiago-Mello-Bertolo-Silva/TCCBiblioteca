import { useState, FormEvent, useRef } from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { cadastroSchema } from '@/schemas/cadastroSchema';

export default function CadastroForm() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',
    });

    const inputRefs = {
        nome: useRef<HTMLInputElement | null>(null),
        email: useRef<HTMLInputElement | null>(null),
        telefone: useRef<HTMLInputElement | null>(null),
        senha: useRef<HTMLInputElement | null>(null),
        confirmarSenha: useRef<HTMLInputElement | null>(null),
    };

    const navigate = useNavigate();

    const formatarTelefone = (valor: string) => {
        const numeros = valor.replace(/\D/g, '');

        if (numeros.length <= 2) return `(${numeros}`;
        if (numeros.length <= 7) return `(${numeros.slice(0, 2)})${numeros.slice(2)}`;
        if (numeros.length <= 11) return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7)}`;

        return `(${numeros.slice(0, 2)})${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorFormatado = formatarTelefone(e.target.value);
        setTelefone(valorFormatado);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({
            nome: '',
            email: '',
            telefone: '',
            senha: '',
            confirmarSenha: '',
        });
        setMensagem('');

        // Validação com Zod
        const result = cadastroSchema.safeParse({ nome, email, telefone, senha, confirmarSenha });

        if (!result.success) {
            const fieldErrors: any = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof typeof errors;
                fieldErrors[field] = err.message;
            });
            setErrors((prev) => ({ ...prev, ...fieldErrors }));

            // Focar no primeiro campo inválido
            const firstField = result.error.errors[0].path[0] as keyof typeof inputRefs;
            inputRefs[firstField]?.current?.focus();
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/enviar-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, telefone, senha }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message === 'E-mail já está cadastrado.') {
                    setMensagem('Este e-mail já está em uso. Tente fazer login ou usar outro e-mail.');
                } else {
                    setMensagem('Erro ao enviar e-mail. Tente novamente.');
                }
                return;
            }

            setMensagem('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');
            setTimeout(() => navigate('/'), 4000);

        } catch (error) {
            console.error('Erro de conexão:', error);
            setMensagem('Erro de conexão. Tente novamente.');
        }
    };

    return (
        <div className='flex flex-col items-start gap-[1rem] bg-blue-50 text-blue-900 w-[24em] p-[1em_2em] rounded-md shadow-md border border-blue-600'>
            <label className='text-[2em] font-bold '>Cadastro</label>

            {mensagem && (
                <div
                    className={`w-full px-4 py-2 rounded text-sm text-center border ${mensagem.includes('sucesso')
                            ? 'bg-blue-100 border-blue-400 text-blue-700'
                            : 'bg-red-100 border-red-400 text-red-700'
                        }`}
                >
                    {mensagem}
                </div>
            )}

            <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-[1.2em]'>

                    <div className='flex gap-2 items-center bg-blue-300 px-3 py-2 rounded'>
                        <FaRegCircleUser />
                        <input
                            ref={inputRefs.nome}
                            type='text'
                            placeholder='Nome completo'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className='bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none'
                        />
                    </div>
                    {errors.nome && <p className='text-red-600 text-xs'>{errors.nome}</p>}

                    <div className='flex gap-2 items-center bg-blue-300 px-3 py-2 rounded'>
                        <MdOutlineEmail />
                        <input
                            ref={inputRefs.email}
                            type='email'
                            placeholder='E-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none'
                        />
                    </div>
                    {errors.email && <p className='text-red-600 text-xs'>{errors.email}</p>}

                    <div className='flex gap-2 items-center bg-blue-300 px-3 py-2 rounded'>
                        <MdOutlinePhone />
                        <input
                            ref={inputRefs.telefone}
                            type='text'
                            placeholder='Telefone'
                            value={telefone}
                            onChange={handleTelefoneChange}
                            className='bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none'
                            maxLength={15}
                        />
                    </div>
                    {errors.telefone && <p className='text-red-600 text-xs'>{errors.telefone}</p>}

                    <div className='flex gap-2 items-center bg-blue-300 px-3 py-2 rounded'>
                        <CiLock />
                        <input
                            ref={inputRefs.senha}
                            type='password'
                            placeholder='Senha'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className='bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none'
                        />
                    </div>
                    {errors.senha && <p className='text-red-600 text-xs'>{errors.senha}</p>}

                    <div className='flex gap-2 items-center bg-blue-300 px-3 py-2 rounded'>
                        <CiLock />
                        <input
                            ref={inputRefs.confirmarSenha}
                            type='password'
                            placeholder='Confirmar senha'
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            className='bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none'
                        />
                    </div>
                    {errors.confirmarSenha && <p className='text-red-600 text-xs'>{errors.confirmarSenha}</p>}

                    <button
                        className='w-full h-[3em] rounded-md text-white bg-red-600 cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-500 hover:shadow-lg hover:scale-105'
                        type='submit'
                    >
                        Cadastrar
                    </button>
                </div>
            </form>

            <div className="text-sm text-blue-900 mt-2 w-full text-center">
                Já tem uma conta?{' '}
                <a href="/" className="text-blue-700 hover:underline">
                    Faça login
                </a>
            </div>
        </div>
    );
}
