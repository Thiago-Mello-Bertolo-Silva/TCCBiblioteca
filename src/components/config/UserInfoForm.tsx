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

  // Buscar dados atuais do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`http://localhost:3000/usuario/${user.id}`);
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

  // Atualiza o estado local conforme os campos são digitados
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Envia os dados atualizados ao backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await axios.put(`http://localhost:3000/usuario/${user.id}`, {
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
      });

      // Atualiza o contexto de usuário com os dados novos
      setUser({ ...user, ...userData });

      // Exibe a mensagem de sucesso no site
      setMensagemSucesso(true);
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      const message =
        error?.response?.data?.error || "Erro ao atualizar os dados.";
      alert(message);
    }
  };

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="nome"
          value={userData.nome}
          onChange={handleChange}
          placeholder="Nome completo"
          required
        />
        <Input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <Input
          type="text"
          name="telefone"
          value={userData.telefone}
          onChange={handleChange}
          placeholder="Telefone"
          required
        />
        <Button type="submit">Salvar alterações</Button>
      </form>

      {/* ✅ Mensagem visual de sucesso */}
      {mensagemSucesso && (
        <Alert className="bg-green-50 border border-green-600 text-green-800">
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
