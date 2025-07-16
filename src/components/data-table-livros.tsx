import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useLivrosColumns, Livro } from "@/hooks/useLivrosColumns";
import { CreateLivrosDialog } from "@/components/buttons/CreateLivrosDialog";
import { EditLivrosDialog } from "@/components/buttons/EditLivrosDialog";
import { DeleteLivrosDialog } from "@/components/buttons/DeleteLivrosDialog";

interface DataTableLivrosProps {
  data: Livro[];
  onRefreshLivros: () => void;
}

export function DataTableLivros({ data, onRefreshLivros }: DataTableLivrosProps) {
  const columns = useLivrosColumns();
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
  const selectedLivro = selectedRows.length === 1 ? selectedRows[0].original : null;

  const handleLivroUpdated = () => {
    table.resetRowSelection();
    onRefreshLivros();
  };

  const handleLivroDeleted = () => {
    table.resetRowSelection();
    onRefreshLivros();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Barra superior */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <Input
          placeholder="Pesquisar título..."
          value={(table.getColumn("titulo")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("titulo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-transparent border border-blue-600 text-blue-800 focus:ring-blue-500 rounded-lg px-4 py-2 shadow-md"
        />
        <div className="flex gap-4">
          <CreateLivrosDialog onLivroCreate={handleLivroUpdated} />
          <EditLivrosDialog
            selectedLivro={selectedLivro}
            onLivroUpdated={handleLivroUpdated}
          />
          <DeleteLivrosDialog
            selectedLivro={selectedLivro}
            onLivroDeleted={handleLivroDeleted}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-blue-600 text-blue-800 hover:bg-blue-300 rounded-lg shadow-md">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
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

      {/* Tabela aprimorada */}
      <div className="w-full overflow-hidden rounded-2xl border border-blue-600 shadow-lg backdrop-blur-md bg-white/30">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-blue-500 text-white rounded-t-2xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-4 text-center font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="border-b last:border-0 transition-all cursor-pointer hover:scale-105 hover:shadow-md rounded-md"
                  onClick={() => row.toggleSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-blue-800">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação aprimorada */}
      <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-6 px-6">
        <div className="flex-1 text-sm text-blue-600">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-blue-600 text-blue-800 hover:bg-blue-400 shadow-md">
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="border-blue-600 text-blue-800 hover:bg-blue-400 shadow-md">
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
