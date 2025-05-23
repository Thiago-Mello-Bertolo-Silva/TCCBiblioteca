// src/components/app-sidebar.tsx
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
  {
    title: "Usuários registrados",
    url: "/Usuarios",
  },
  {
    title: "Coleção de livros",
    url: "/Livros",
  },
  {
    title: "Lívros emprestados",
    url: "/Emprestimos",
  },
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
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home">
                <div className="flex size-8 items-center rounded-lg bg-blue text-sidebar-primary-foreground">
                  <img src="/logoBiblioteca.png" alt="Biblioteca Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nuvem</span>
                  <span className="truncate text-xs">Biblioteca digital</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={isActive ? "text-bold text-blue-500" : ""}
                >
                  <Link to={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 px-2 pb-4">
        {/* Botões fixos acima do perfil */}
        <Button
          variant="ghost"
          className="justify-start w-full"
          onClick={() => navigate("/configuracoes")}
        >
          Configuração
        </Button>
        <Button
          variant="ghost"
          className="justify-start w-full text-red-500"
          onClick={handleLogout}
        >
          Logout
        </Button>

        {/* Perfil do usuário */}
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
