import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useUsuariosColumns, Usuario } from "@/hooks/useUsuariosColumns";
import { EditUsuarioDialog } from "@/components/buttons/EditUsuarioDialog";
import { CreateUsuarioDialog } from "@/components/buttons/CreateUsuarioDialog";
import { DeleteUsuarioDialog } from "@/components/buttons/DeleteUsuarioDialog";

interface DataTableUsuariosProps {
  data: Usuario[];
  onRefreshUsuarios: () => void; 
}

export function DataTableUsuarios({ data, onRefreshUsuarios }: DataTableUsuariosProps) {
  const columns = useUsuariosColumns();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedUser = selectedRows.length === 1 ? selectedRows[0].original : null;

  const handleUserUpdated = () => {
    table.resetRowSelection();
    onRefreshUsuarios(); 
  };

  const handleUserDeleted = () => {
    table.resetRowSelection();
    onRefreshUsuarios(); 
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 z-10">
      <div className="flex flex-col sm:flex-row items-center justify-between py-4">
        <Input
          placeholder="Pesquisar e-mail..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mb-4 sm:mb-0"
        />
        <div className="flex gap-2">
          <CreateUsuarioDialog onUsuarioCriado={handleUserUpdated} /> {/* Botão Criar */}
          <EditUsuarioDialog
            selectedUser={selectedUser}
            onUserUpdated={handleUserUpdated}
          /> {/* Botão Editar */}
          <DeleteUsuarioDialog
            selectedUser={selectedUser}
            onUserDeleted={handleUserDeleted}
          /> {/* Botão Deletar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>

<div className="w-full overflow-x-auto rounded-lg border shadow bg-background z-10">
  <Table>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-gray-100 dark:bg-gray-800">
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="px-4 py-2 text-sm font-medium text-center text-gray-800 dark:text-gray-100"
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="border-b last:border-0"
            onClick={() => row.toggleSelected()}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-4 py-2 text-center text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Sem resultados.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>

<div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4 px-4 sm:px-6">
  <div className="flex-1 text-sm text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} de{" "}
    {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
  </div>
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Anterior
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Próxima
    </Button>
  </div>
</div>
</div>
)
}
