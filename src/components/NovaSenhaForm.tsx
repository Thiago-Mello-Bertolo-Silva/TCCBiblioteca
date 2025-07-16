// src/components/NovaSenhaForm.tsx
import { useNavigate, useParams } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { novaSenhaSchema, NovaSenhaSchema } from "@/schemas/novaSenhaSchema";
import { useState } from "react";

export default function NovaSenhaForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NovaSenhaSchema>({
    resolver: zodResolver(novaSenhaSchema),
  });

  async function onSubmit(values: NovaSenhaSchema) {
    setMensagem("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKENDURL}/nova-senha/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ novaSenha: values.novaSenha }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.message || "Erro ao redefinir senha.");
        return;
      }

      // sucesso
      reset();
      setMensagem("Senha redefinida com sucesso! Você será redirecionado...");
      setTimeout(() => {
        navigate("/", {
          state: { message: "Senha redefinida com sucesso! Faça login." },
        });
      }, 3500);
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 bg-blue-50 p-8 rounded-lg shadow-2xl border border-blue-600">
      <h2 className="text-3xl font-bold text-blue-800">Redefinir Senha</h2>

      {mensagem && (
        <p className="w-full text-center text-sm px-4 py-2 rounded bg-blue-100 border border-blue-400 text-blue-700">
          {mensagem}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {/* Nova senha */}
        <div className="relative flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-lg">
          <MdLock className="text-white" />
          <input
            type="password"
            placeholder="Nova senha"
            className="bg-transparent border-none text-blue-800 w-full placeholder-blue-800 focus:outline-none"
            {...register("novaSenha")}
          />
        </div>
        {errors.novaSenha && (
          <p className="text-red-500 text-sm">{errors.novaSenha.message}</p>
        )}

        {/* Confirmar senha */}
        <div className="relative flex items-center gap-2 bg-blue-300 px-4 py-2 rounded-lg">
          <MdLock className="text-white" />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className="bg-transparent border-none text-blue-800 w-full placeholder-blue-800 focus:outline-none"
            {...register("confirmarSenha")}
          />
        </div>
        {errors.confirmarSenha && (
          <p className="text-red-500 text-sm">{errors.confirmarSenha.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium transition-all duration-300 hover:bg-blue-500 hover:scale-105 shadow-md disabled:opacity-60"
        >
          {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
        </button>
      </form>
    </div>
  );
}
