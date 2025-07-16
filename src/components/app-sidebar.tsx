import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./ui/nav-user"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuth } from "@/contexts/authContext"
import { Button } from "@/components/ui/button"

const navItems = [
  { title: "Página de Início", url: "/Welcome" },
  { title: "Usuários Registrados", url: "/Usuarios" },
  { title: "Coleção de Livros", url: "/Livros" },
  { title: "Meus livros emprestados", url: "/MeusLivros" },
  { title: "Livros Emprestados", url: "/Emprestimos" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  return (
    <Sidebar
      {...props}
      className="bg-background text-foreground border-r border-border shadow-xl"
    >
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home" className="flex items-center gap-3">
                <img
                  src="/logoBiblioteca1.png"
                  alt="Biblioteca Logo"
                  className="h-10 w-auto opacity-90"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-bold text-primary">Biblioteca do PPGE</span>
                  <span className="text-primary text-muted">Biblioteca Digital</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-blue-400"
                  }`}
                >
                  <Link to={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-3 px-4 py-4 border-t border-border">
        <Button
          variant="ghost"
          className="justify-start w-full text-primary hover:text-primary-hover hover:bg-blue-400 transition-all duration-300"
          onClick={() => navigate("/configuracoes")}
        >
          Configuração
        </Button>
        <Button
          variant="ghost"
          className="justify-start w-full text-red-500 hover:text-destructive-hover hover:bg-red-300 transition-all duration-300"
          onClick={handleLogout}
        >
          Logout
        </Button>

        <NavUser
          user={{
            name: user?.nome || "Usuário",
            email: user?.email || "email@example.com",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
