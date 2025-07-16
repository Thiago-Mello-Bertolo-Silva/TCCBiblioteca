import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth, User } from '@/contexts/authContext';
import { CiLock } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: data.email, password: data.password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const result = await response.json();
      localStorage.setItem("token", result.token);
      const decoded = jwtDecode(result.token) as User; 
      setUser(decoded);
      navigate("/load-user");
    } catch (error) {
      console.error("Erro ao logar:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-blue-50 p-8 rounded-lg shadow-2xl border border-blue-600">
      <h2 className="text-3xl font-bold text-blue-900">Acesse sua conta</h2>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-lg">
          <FaRegCircleUser className="text-blue-900" />
          <input
            type="text"
            placeholder="E-mail"
            {...register("email")}
            className="bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none"
          />
        </div>
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

        <div className="relative flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-lg">
          <CiLock className="text-blue-900" />
          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
            className="bg-transparent border-none text-blue-900 w-full placeholder-blue-900 focus:outline-none"
          />
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-md"
        >
          Entrar
        </button>
      </form>

      <a href="/Cadastrar" className="w-full">
        <button className="w-full py-3 mt-2 bg-red-600 text-white rounded-lg hover:bg-red-500 hover:scale-105 transition">
          Criar conta
        </button>
      </a>

      <div className="text-sm text-blue-900 mt-2 w-full text-center">
        Esqueceu sua senha?{' '}
        <a href="/Recuperacao" className="text-blue-700 hover:underline">
          Clique aqui para recuperar
        </a>
      </div>
    </div>
  );
}
