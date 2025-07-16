import { useAuth } from "@/contexts/authContext";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WelcomePage() {
  const { user } = useAuth();

  return (
    <div
      className="flex flex-col items-center min-h-screen px-6 py-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://en.vbackground.com/en/wp-content/uploads/2020/05/black_board.jpg)",
      }}
    >
      {/* Mensagem de Boas-Vindas - Agora mais para cima */}
      <div className="text-center bg-blue-50  px-10 py-6 rounded-xl shadow-lg mt-4">
        <h1 className="text-4xl font-extrabold text-blue-900">
          Bem-vindo de volta, {user?.nome?.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-lg text-blue-800">
          Estamos felizes em tê-lo(a) novamente por aqui. Acesse rapidamente os
          recursos da biblioteca.
        </p>
      </div>

      {/* Cartões - Subindo posição */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <Card className="bg-blue-50 border border-blue-600 shadow-xl rounded-lg transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-800">
              Catálogo de Livros
            </CardTitle>
            <CardDescription className="text-blue-700">
              Explore os livros disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/livros">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 rounded-lg shadow-md">
                Ver Livros
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-600 shadow-xl rounded-lg transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-800">
              Seus Empréstimos
            </CardTitle>
            <CardDescription className="text-blue-700">
              Acompanhe seus livros emprestados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/emprestimos">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 rounded-lg shadow-md">
                Ver Empréstimos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-600 shadow-xl rounded-lg transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-800">
              Seu Perfil
            </CardTitle>
            <CardDescription className="text-blue-700">
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/configuracoes">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 rounded-lg shadow-md">
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
