// src/hooks/useEmprestimosColumns.tsx
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";

export interface Emprestimo {
  id: number;
  usuarioId: number;
  livroId: number;
  nomeUsuario: string; // <- campo já achatado
  nomeLivro: string;   // <- campo já achatado
  dataEmprestimo: string;
  dataDevolucao: string;
  status: string;
}

export function useEmprestimosColumns(): ColumnDef<Emprestimo>[] {
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "nomeUsuario",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Usuário
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.getValue("nomeUsuario")}
          </div>
        ),
      },
      {
        accessorKey: "nomeLivro",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Livro
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("nomeLivro")}</div>
        ),
      },
      {
        accessorKey: "dataEmprestimo",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Empréstimo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.getValue("dataEmprestimo")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "dataDevolucao",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Devolução
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.getValue("dataDevolucao")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="text-center">
            {row.getValue("status") === "Concluído"
              ? "✅ Concluído"
              : "📚 Em andamento"}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const emprestimo = row.original;

          const handleEditClick = () => {
            navigate(`/emprestimo/${emprestimo.id}`);
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(emprestimo.nomeLivro)
                  }
                >
                  Copiar Livro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditClick}>
                  Editar Empréstimo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    console.log("Remover empréstimo ainda não implementado")
                  }
                >
                  Remover Empréstimo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [navigate]
  );
}
