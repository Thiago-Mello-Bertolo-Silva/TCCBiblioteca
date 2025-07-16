// components/layout/Topbar.tsx
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList,} from "@/components/ui/navigation-menu";

export default function Topbar() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white border-b shadow-sm flex items-center justify-between px-6 py-3">
      {/* Menu de navegação à esquerda */}
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <Link
              to="/home"
              className="font-medium text-gray-700 hover:text-green-600"
            >
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/livros"
              className="font-medium text-gray-700 hover:text-green-600"
            >
              Livros
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/usuarios"
              className="font-medium text-gray-700 hover:text-green-600"
            >
              Usuários
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/emprestimos"
              className="font-medium text-gray-700 hover:text-green-600"
            >
              Empréstimos
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Seção do usuário à direita */}
      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <Link
                to="/configuracoes"
                className="font-medium text-gray-700 hover:text-green-600"
              >
                Configurações
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={() => console.log("Logout")}
                className="font-medium text-gray-700 hover:text-red-600"
              >
                Sair
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
