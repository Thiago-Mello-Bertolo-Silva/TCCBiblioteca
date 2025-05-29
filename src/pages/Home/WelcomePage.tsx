// src/pages/home/WelcomePage.tsx
import { useAuth } from "@/contexts/authContext"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function WelcomePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold">Bem-vindo de volta, {user?.nome?.split(" ")[0]}!</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Estamos felizes em tê-lo(a) novamente por aqui. Acesse rapidamente os recursos da biblioteca.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Livros</CardTitle>
            <CardDescription>Explore os livros disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/livros">
              <Button className="w-full">Ver Livros</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus Empréstimos</CardTitle>
            <CardDescription>Acompanhe seus livros emprestados</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/emprestimos">
              <Button className="w-full">Ver Empréstimos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/configuracoes">
              <Button className="w-full">Editar Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
