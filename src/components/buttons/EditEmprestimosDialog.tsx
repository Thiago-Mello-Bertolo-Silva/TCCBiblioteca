// src/components/buttons/EditEmprestimosDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { Usuario } from "@/types/Usuario";
import { Livro } from "@/types/Livro";
import { useAuth } from "@/contexts/authContext";

interface EditEmprestimosDialogProps {
  selectedEmprestimo: Emprestimo | null;
  onEmprestimoUpdated: () => void;
}

export function EditEmprestimosDialog({
  selectedEmprestimo,
  onEmprestimoUpdated,
}: EditEmprestimosDialogProps) {
  const { user } = useAuth(); // ✅ Hook de autenticação
  const [open, setOpen] = useState(false);
  const [usuarioBusca, setUsuarioBusca] = useState("");
  const [livroBusca, setLivroBusca] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [livroId, setLivroId] = useState("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataPrevistoDevolucao, setDataPrevistoDevolucao] = useState<string>("");
  const [status, setStatus] = useState<string>("emprestado");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [usuariosResponse, livrosResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuarios`),
        fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livros`),
      ]);
      const usuariosData = await usuariosResponse.json();
      const livrosData = await livrosResponse.json();
      setUsuarios(usuariosData);
      setLivros(livrosData);
    }
    fetchData();
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && selectedEmprestimo) {
      const usuario = usuarios.find((u) => u.id === selectedEmprestimo.usuarioId);
      const livro = livros.find((l) => l.id === selectedEmprestimo.livroId);

      setUsuarioId(selectedEmprestimo.usuarioId.toString());
      setLivroId(selectedEmprestimo.livroId.toString());
      setUsuarioBusca(usuario?.nome || "");
      setLivroBusca(livro?.titulo || "");
      setDataInicio(String(selectedEmprestimo.dataInicio));
      setDataPrevistoDevolucao(String(selectedEmprestimo.dataPrevistoDevolucao));
      setStatus(selectedEmprestimo.status || "emprestado");
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmprestimo) return;

    await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/emprestimo/${selectedEmprestimo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId: Number(usuarioId),
        livroId: Number(livroId),
        dataInicio,
        dataPrevistoDevolucao,
        status,
      }),
    });

    setOpen(false);
    onEmprestimoUpdated();
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(usuarioBusca.toLowerCase())
  );

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(livroBusca.toLowerCase())
  );

  // ✅ Verificação: só exibe botão se usuário for admin
  if (!user || user.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!selectedEmprestimo}>Editar Empréstimo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Empréstimo</DialogTitle>
          <DialogDescription>Atualize os dados do empréstimo selecionado.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Campo de busca de Usuário */}
          <div className="grid gap-2 relative">
            <Label>Buscar Usuário</Label>
            <Input
              placeholder="Digite o nome do usuário"
              value={usuarioBusca}
              onChange={(e) => {
                setUsuarioBusca(e.target.value);
                setUsuarioId("");
              }}
            />
            {usuarioBusca && !usuarioId && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <div
                      key={usuario.id}
                      onClick={() => {
                        setUsuarioBusca(usuario.nome);
                        setUsuarioId(usuario.id.toString());
                      }}
                      className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      {usuario.nome}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Nenhum usuário encontrado</div>
                )}
              </div>
            )}
          </div>

          {/* Campo de busca de Livro */}
          <div className="grid gap-2 relative">
            <Label>Buscar Livro</Label>
            <Input
              placeholder="Digite o nome do livro"
              value={livroBusca}
              onChange={(e) => {
                setLivroBusca(e.target.value);
                setLivroId("");
              }}
            />
            {livroBusca && !livroId && (
              <div className="absolute z-10 top-full left-0 right-0 border rounded-md max-h-40 overflow-y-auto bg-white shadow dark:bg-zinc-900">
                {livrosFiltrados.length > 0 ? (
                  livrosFiltrados.map((livro) => (
                    <div
                      key={livro.id}
                      onClick={() => {
                        setLivroBusca(livro.titulo);
                        setLivroId(livro.id.toString());
                      }}
                      className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      {livro.titulo}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Nenhum livro encontrado</div>
                )}
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid gap-2">
            <Label>Data de Início</Label>
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Data Prevista de Devolução</Label>
            <Input type="date" value={dataPrevistoDevolucao} onChange={(e) => setDataPrevistoDevolucao(e.target.value)} />
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emprestado">Emprestado</SelectItem>
                <SelectItem value="devolvido">Devolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
