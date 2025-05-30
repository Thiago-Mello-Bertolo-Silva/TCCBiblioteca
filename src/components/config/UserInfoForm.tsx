import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface UserData {
  nome: string;
  email: string;
  telefone: string;
}

export function UserInfoForm() {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    nome: "",
    email: "",
    telefone: "",
  });
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuario/${user.id}`);
        setUserData({
          nome: res.data.nome,
          email: res.data.email,
          telefone: res.data.telefone,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserInfo();
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await axios.put(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuario/${user.id}`, {
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
      });

      setUser({ ...user, ...userData });
      setMensagemSucesso(true);
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      const message =
        error?.response?.data?.error || "Erro ao atualizar os dados.";
      alert(message);
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-4">Informações do Usuário</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-3 px-4 py-2 rounded-lg border border-green-600">
          <Input
            type="text"
            name="nome"
            value={userData.nome}
            onChange={handleChange}
            placeholder="Nome completo"
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
            required
          />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-2 rounded-lg border border-green-600">
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
            required
          />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-2 rounded-lg border border-green-600">
          <Input
            type="text"
            name="telefone"
            value={userData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-md"
        >
          Salvar alterações
        </Button>
      </form>

      {mensagemSucesso && (
        <Alert className="mt-4 border border-green-600 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="font-semibold">Sucesso!</AlertTitle>
          <AlertDescription>
            As informações foram atualizadas com sucesso. <br />
            Faça logout e login novamente para ver as mudanças aplicadas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
