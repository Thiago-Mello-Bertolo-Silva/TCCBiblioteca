// src/components/buttons/EditEmprestimosDialog.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { useAuth } from "@/contexts/authContext";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { Usuario } from "@/types/Usuario";
import { Livro } from "@/types/Livro";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emprestimoSchema, EmprestimoFormData,} from "@/schemas/EmprestimoSchema";

interface EditEmprestimosDialogProps {
  selectedEmprestimo: Emprestimo | null;
  onEmprestimoUpdated: () => void;
}

export function EditEmprestimosDialog({
  selectedEmprestimo,
  onEmprestimoUpdated,
}: EditEmprestimosDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [buscaUsuario, setBuscaUsuario] = useState("");
  const [buscaLivro, setBuscaLivro] = useState("");

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmprestimoFormData>({
    resolver: zodResolver(emprestimoSchema),
    defaultValues: {
      usuarioId: 0,
      livroId: 0,
      dataInicio: "",
      dataPrevistoDevolucao: "",
      status: "emprestado",
    },
  });

  /* -------------------------------------------------- */
  /* Carrega usuários e livros                           */
  /* -------------------------------------------------- */
  useEffect(() => {
    async function fetchData() {
      const [usuariosRes, livrosRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuarios`),
        fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livros`),
      ]);
      setUsuarios(await usuariosRes.json());
      setLivros(await livrosRes.json());
    }
    fetchData();
  }, []);

  /* -------------------------------------------------- */
  /* Quando abre o modal – preenche dados atuais        */
  /* -------------------------------------------------- */
  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (isOpen && selectedEmprestimo) {
      reset({
        usuarioId: selectedEmprestimo.usuarioId,
        livroId: selectedEmprestimo.livroId,
        dataInicio: selectedEmprestimo.dataInicio,
        dataPrevistoDevolucao: selectedEmprestimo.dataPrevistoDevolucao,
        status: selectedEmprestimo.status as "emprestado" | "devolvido",
      });

      const usuario = usuarios.find(
        (u) => u.id === selectedEmprestimo.usuarioId
      );
      const livro = livros.find((l) => l.id === selectedEmprestimo.livroId);
      setBuscaUsuario(usuario?.nome ?? "");
      setBuscaLivro(livro?.titulo ?? "");
    }
  }

  /* -------------------------------------------------- */
  /* Envia PUT com validação do Zod                     */
  /* -------------------------------------------------- */
  async function onSubmit(data: EmprestimoFormData) {
    if (!selectedEmprestimo) return;

    await fetch(
      `${import.meta.env.VITE_PUBLIC_BACKENDURL}/emprestimo/${selectedEmprestimo.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    setOpen(false);
    onEmprestimoUpdated();
  }

  /* -------------------------------------------------- */
  /* Filtros para busca                                 */
  /* -------------------------------------------------- */
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase())
  );
  const livrosFiltrados = livros.filter((l) =>
    l.titulo.toLowerCase().includes(buscaLivro.toLowerCase())
  );

  if (!user || user.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!selectedEmprestimo}>Editar Empréstimo</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Empréstimo</DialogTitle>
          <DialogDescription>
            Atualize as informações do empréstimo.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 py-4 text-sm"
        >
          {/* --- Usuário ------------------------------------------------ */}
          <div className="grid gap-2 relative">
            <Label>Buscar Usuário</Label>
            <Input
              value={buscaUsuario}
              onChange={(e) => {
                setBuscaUsuario(e.target.value);
                setValue("usuarioId", 0);
              }}
              placeholder="Digite o nome do usuário"
            />
            {buscaUsuario && !errors.usuarioId && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {usuariosFiltrados.length ? (
                  usuariosFiltrados.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setBuscaUsuario(u.nome);
                        setValue("usuarioId", u.id);
                      }}
                      className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      {u.nome}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Nenhum usuário</div>
                )}
              </div>
            )}
            {errors.usuarioId && (
              <span className="text-red-500">{errors.usuarioId.message}</span>
            )}
          </div>

          {/* --- Livro -------------------------------------------------- */}
          <div className="grid gap-2 relative">
            <Label>Buscar Livro</Label>
            <Input
              value={buscaLivro}
              onChange={(e) => {
                setBuscaLivro(e.target.value);
                setValue("livroId", 0);
              }}
              placeholder="Digite o título do livro"
            />
            {buscaLivro && !errors.livroId && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {livrosFiltrados.length ? (
                  livrosFiltrados.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setBuscaLivro(l.titulo);
                        setValue("livroId", l.id);
                      }}
                      className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      {l.titulo}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Nenhum livro</div>
                )}
              </div>
            )}
            {errors.livroId && (
              <span className="text-red-500">{errors.livroId.message}</span>
            )}
          </div>

          {/* --- Datas -------------------------------------------------- */}
          <div className="grid gap-2">
            <Label>Data de Início</Label>
            <Controller
              control={control}
              name="dataInicio"
              render={({ field }) => (
                <Input type="date" {...field} placeholder="YYYY-MM-DD" />
              )}
            />
            {errors.dataInicio && (
              <span className="text-red-500">{errors.dataInicio.message}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Data Prevista de Devolução</Label>
            <Controller
              control={control}
              name="dataPrevistoDevolucao"
              render={({ field }) => (
                <Input type="date" {...field} placeholder="YYYY-MM-DD" />
              )}
            />
            {errors.dataPrevistoDevolucao && (
              <span className="text-red-500">
                {errors.dataPrevistoDevolucao.message}
              </span>
            )}
          </div>

          {/* --- Status ------------------------------------------------- */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emprestado">Emprestado</SelectItem>
                    <SelectItem value="devolvido">Devolvido</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
