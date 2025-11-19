// src/hooks/useLivrosColumns.tsx
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

export interface Livro {
  id: number;
  titulo: string;
  categorias: string;
  autores: string;
  editora: string;
  anoPublicacao: number;
  edicao: string;
  linkOnline: string;
  disponivel: string; // "Sim" ou "Não"
}

export function useLivrosColumns(): ColumnDef<Livro>[] {
  const navigate = useNavigate();

  return useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "titulo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center font-medium">{row.getValue("titulo")}</div>,
    },
    {
      accessorKey: "categorias",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categorias
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("categorias")}</div>,
    },
    {
      accessorKey: "autores",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Autores
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("autores")}</div>,
    },
    {
      accessorKey: "editora",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Editora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("editora")}</div>,
    },
    {
      accessorKey: "anoPublicacao",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ano
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("anoPublicacao")}</div>,

      // 👇 Esta função permite comparar string com número
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        return String(value).includes(String(filterValue));
      },
    },
    {
      accessorKey: "edicao",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Edição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("edicao")}</div>,
    },
    {
      accessorKey: "linkOnline",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Link Online
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const valor = row.getValue("linkOnline") as string;
        if (!valor) return <div className="text-center text-muted-foreground">—</div>;

        const [mensagem, link] = valor.split(",").map(part => part.trim());

        return (
          <div className="text-center space-y-1">
            <div className="text-sm">{mensagem}</div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {link}
            </a>
          </div>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = (rowA.getValue(columnId) as string)?.split(",")[0]?.trim() || "";
        const b = (rowB.getValue(columnId) as string)?.split(",")[0]?.trim() || "";
        return a.localeCompare(b);
      },
    },
    {
      accessorKey: "disponivel",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Disponível
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("disponivel") === "Sim" ? "✅ Sim" : "❌ Não"}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);

        if (a === b) return 0;
        if (a === "Sim") return 1; // Coloca "Sim" depois na ordem crescente
        return -1;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const livro = row.original;

        const handleEditClick = () => {
          navigate(`/livro/${livro.id}`);
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
                onClick={() => navigator.clipboard.writeText(livro.titulo)}
                className="hover:bg-muted focus:bg-muted active:bg-muted/80 transition-colors"
              >
                Copiar Título
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleEditClick}
                className="hover:bg-muted focus:bg-muted active:bg-muted/80 transition-colors"
              >
                Editar Livro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Remover livro ainda não implementado")}
                className="hover:bg-muted focus:bg-muted active:bg-muted/80 transition-colors"
              >
                Remover Livro
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [navigate]);
}
