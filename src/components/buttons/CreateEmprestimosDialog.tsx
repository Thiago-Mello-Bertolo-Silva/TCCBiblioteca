// src/components/buttons/CreateEmprestimosDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/authContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmprestimoSchema,
  CreateEmprestimoFormData,
} from "@/schemas/createEmprestimoSchema";

interface Usuario {
  id: number;
  nome: string;
}

interface Livro {
  id: number;
  titulo: string;
}

interface CreateEmprestimosDialogProps {
  onEmprestimoCriado: () => void;
}

export function CreateEmprestimosDialog({
  onEmprestimoCriado,
}: CreateEmprestimosDialogProps) {
  const { user } = useAuth();

  /* ------------------------------------------------------------------ */
  /* form (react‑hook‑form + zod)                                       */
  /* ------------------------------------------------------------------ */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateEmprestimoFormData>({
    resolver: zodResolver(createEmprestimoSchema),
    defaultValues: {
      usuarioId: "",
      livroId: "",
      dataInicio: "",
      dataPrevistoDevolucao: "",
      status: "emprestado",
    },
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  /* -------------------- buscas autocompletes ----------------------- */
  const [usuarioBusca, setUsuarioBusca] = useState("");
  const [livroBusca, setLivroBusca] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usuariosRes, livrosRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuarios`),
          fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livros`),
        ]);

        setUsuarios(await usuariosRes.json());
        setLivros(await livrosRes.json());
      } catch (e) {
        console.error("Erro ao buscar usuários/livros:", e);
      }
    }
    fetchData();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(usuarioBusca.toLowerCase())
  );
  const livrosFiltrados = livros.filter((l) =>
    l.titulo.toLowerCase().includes(livroBusca.toLowerCase())
  );

  /* ---------------------------- submit ------------------------------ */
  const onSubmit = async (data: CreateEmprestimoFormData) => {
    setLoading(true);
    setErro("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKENDURL}/emprestimo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: Number(data.usuarioId),
            livroId: Number(data.livroId),
            dataInicio: data.dataInicio,
            dataPrevistoDevolucao: data.dataPrevistoDevolucao,
            status: data.status,
          }),
        }
      );

      if (!res.ok) throw new Error("Livro não está disponível no momento");

      reset();
      setOpen(false);
      onEmprestimoCriado();
    } catch (e: any) {
      setErro(e.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- somente administradores -------------------- */
  if (!user || user.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Empréstimo</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
          <DialogDescription>
            Preencha as informações para registrar um novo empréstimo.
          </DialogDescription>
        </DialogHeader>

        {/* ---------------------- FORM -------------------------------- */}
        <form
          className="grid gap-4 py-4"
          onSubmit={handleSubmit(onSubmit)}
          id="form-emprestimo"
        >
          {/* Usuário */}
          <div className="grid gap-2 relative">
            <Label>Buscar Usuário</Label>
            <Input
              placeholder="Digite o nome do usuário"
              value={usuarioBusca}
              onChange={(e) => {
                setUsuarioBusca(e.target.value);
                setValue("usuarioId", "");
              }}
            />
            {usuarioBusca && !watch("usuarioId") && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {usuariosFiltrados.length ? (
                  usuariosFiltrados.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setUsuarioBusca(u.nome);
                        setValue("usuarioId", String(u.id));
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
              <span className="text-red-500 text-sm">
                {errors.usuarioId.message}
              </span>
            )}
          </div>

          {/* Livro */}
          <div className="grid gap-2 relative">
            <Label>Buscar Livro</Label>
            <Input
              placeholder="Digite o título do livro"
              value={livroBusca}
              onChange={(e) => {
                setLivroBusca(e.target.value);
                setValue("livroId", "");
              }}
            />
            {livroBusca && !watch("livroId") && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {livrosFiltrados.length ? (
                  livrosFiltrados.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        setLivroBusca(l.titulo);
                        setValue("livroId", String(l.id));
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
              <span className="text-red-500 text-sm">
                {errors.livroId.message}
              </span>
            )}
          </div>

          {/* Datas */}
          <div className="grid gap-2">
            <Label>Data de Início</Label>
            <Input type="date" {...register("dataInicio")} />
            {errors.dataInicio && (
              <span className="text-red-500 text-sm">
                {errors.dataInicio.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Data Prevista de Devolução</Label>
            <Input type="date" {...register("dataPrevistoDevolucao")} />
            {errors.dataPrevistoDevolucao && (
              <span className="text-red-500 text-sm">
                {errors.dataPrevistoDevolucao.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={watch("status")}
              onValueChange={(val: "emprestado" | "devolvido") => setValue("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emprestado">Emprestado</SelectItem>
                <SelectItem value="devolvido">Devolvido</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <span className="text-red-500 text-sm">
                {errors.status.message}
              </span>
            )}
          </div>
        </form>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <DialogFooter>
          <Button
            type="submit"
            form="form-emprestimo"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
