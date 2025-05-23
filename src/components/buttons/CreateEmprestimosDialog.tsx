// src/components/buttons/CreateEmprestimosDialog.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogDescription, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function CreateEmprestimosDialog({ onEmprestimoCriado }: CreateEmprestimosDialogProps) {
  const [open, setOpen] = useState(false);
  const [usuarioBusca, setUsuarioBusca] = useState("");
  const [livroBusca, setLivroBusca] = useState("");
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [livroId, setLivroId] = useState<string>("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataEmprestimo, setDataEmprestimo] = useState("");
  const [status, setStatus] = useState("emprestado");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const isFormValid = usuarioId && livroId && dataInicio && dataEmprestimo;

  useEffect(() => {
    async function fetchData() {
      try {
        const [usuariosResponse, livrosResponse] = await Promise.all([
          fetch("http://localhost:3000/usuarios"),
          fetch("http://localhost:3000/livros"),
        ]);

        const usuariosData = await usuariosResponse.json();
        const livrosData = await livrosResponse.json();

        setUsuarios(usuariosData);
        setLivros(livrosData);
      } catch (error) {
        console.error("Erro ao buscar usuários e livros:", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/emprestimo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: Number(usuarioId),
          livroId: Number(livroId),
          dataInicio,
          dataEmprestimo,
          status, // Novo campo incluído
        }),
      });

      if (!response.ok) {
        throw new Error("Livro não está disponível no momento");
      }

      // Reset
      setUsuarioBusca("");
      setLivroBusca("");
      setUsuarioId("");
      setLivroId("");
      setDataInicio("");
      setDataEmprestimo("");
      setStatus("emprestado");
      setOpen(false);
      onEmprestimoCriado();
    } catch (err: any) {
      setErro(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(usuarioBusca.toLowerCase())
  );

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(livroBusca.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cadastrar Novo Empréstimo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Empréstimo</DialogTitle>
          <DialogDescription>Preencha as informações para registrar um novo empréstimo.</DialogDescription>
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
                setUsuarioId(""); // Limpa a seleção
              }}
            />
            {usuarioBusca &&
              !usuarioId && (
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
                setLivroId(""); // Limpa a seleção
              }}
            />
            {livroBusca &&
              !livroId && (
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

          {/* Campos de datas */}
          <div className="grid gap-2">
            <Label>Data de Início</Label>
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Data Prevista de Devolução</Label>
            <Input type="date" value={dataEmprestimo} onChange={(e) => setDataEmprestimo(e.target.value)} />
          </div>

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
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !isFormValid}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
