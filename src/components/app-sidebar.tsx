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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { NavUser } from "./ui/nav-user"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuth } from "@/contexts/authContext"
import {
  Bell,
  Home,
  Users,
  BookOpen,
  Bookmark,
  Library,
  LogOut,
  Settings,
  MessageCircle,
  Loader2,
  Send,
} from "lucide-react"

const navItems = [
  { title: "Página de Início", url: "/Welcome", icon: <Home className="w-4 h-4 mr-2" /> },
  { title: "Usuários Registrados", url: "/Usuarios", icon: <Users className="w-4 h-4 mr-2" /> },
  { title: "Coleção de Livros", url: "/Livros", icon: <BookOpen className="w-4 h-4 mr-2" /> },
  { title: "Meus livros emprestados", url: "/MeusLivros", icon: <Bookmark className="w-4 h-4 mr-2" /> },
  { title: "Livros Emprestados", url: "/Emprestimos", icon: <Library className="w-4 h-4 mr-2" /> },
  { title: "Notificações", url: "/Notificacoes", icon: <Bell className="w-4 h-4 mr-2" /> },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const [open, setOpen] = React.useState(false)
  const [titulo, setTitulo] = React.useState("")
  const [mensagem, setMensagem] = React.useState("")
  const [enviado, setEnviado] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/")
  }

  const handleEnviar = async () => {
    if (!titulo.trim() || !mensagem.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/enviar-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, mensagem }),
      })

      if (!response.ok) throw new Error("Erro ao enviar feedback")

      setEnviado(true)
      setTitulo("")
      setMensagem("")
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sidebar
      {...props}
      className="bg-background text-foreground border-r border-border shadow-xl"
    >
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="cursor-pointer">
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
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-blue-400"
                  }`}
                >
                  <Link to={item.url} className="flex items-center">
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}

          {/* Botão de Feedback */}
          <SidebarMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton className="flex items-center hover:bg-blue-400 transition-all duration-300 cursor-pointer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Enviar Feedback</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Feedback</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={5}
                  />
                </div>
                <DialogFooter className="flex flex-col items-start gap-2">
                  <Button
                    onClick={handleEnviar}
                    disabled={!titulo.trim() || !mensagem.trim() || isLoading}
                    className="w-full justify-center cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                  {enviado && !isLoading && (
                    <span className="text-green-500 text-sm">Mensagem enviada com sucesso!</span>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-3 px-4 py-4 border-t border-border">
        <Button
          variant="ghost"
          className="justify-start w-full text-primary hover:text-primary-hover hover:bg-blue-400 transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/configuracoes")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configuração
        </Button>

        <Button
          variant="ghost"
          className="justify-start w-full text-red-500 hover:text-destructive-hover hover:bg-red-300 transition-all duration-300 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
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
