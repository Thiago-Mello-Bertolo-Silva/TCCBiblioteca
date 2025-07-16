import { useState } from "react";
import { Dialog, DialogDescription, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { useAuth } from "@/contexts/authContext";

interface CreateLivrosDialogProps {
  onLivroCreate: () => void;
}

export function CreateLivrosDialog({ onLivroCreate }: CreateLivrosDialogProps) {
  const { user } = useAuth(); // Pega o usuário logado
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autores, setAutores] = useState("");
  const [editora, setEditora] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [edicao, setEdicao] = useState("");
  const [linkOnline, setLinkOnline] = useState("");
  const [disponivel, setDisponivel] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const isFormValid =
    titulo.trim() !== "" &&
    autores.trim() !== "" &&
    editora.trim() !== "" &&
    edicao.trim() !== "" &&
    anoPublicacao.trim() !== "" &&
    linkOnline.trim() !== "";

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          autores,
          editora,
          anoPublicacao: Number(anoPublicacao),
          edicao,
          linkOnline,
          disponivel: disponivel ? "Sim" : "Não",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar livro");
      }

      setTitulo("");
      setAutores("");
      setEditora("");
      setAnoPublicacao("");
      setEdicao("");
      setLinkOnline("");
      setDisponivel(true);
      setOpen(false);
      onLivroCreate();
    } catch (err: any) {
      setErro(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // ⚠️ Apenas admins podem ver o botão e o dialog
  if (user?.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cadastrar Novo Livro</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Livro</DialogTitle>
          <DialogDescription>
            Preencha as informações para cadastrar um novo livro.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título"
            />
          </div>
          <div className="grid gap-2">
            <Label>Autores</Label>
            <Input
              value={autores}
              onChange={(e) => setAutores(e.target.value)}
              placeholder="Digite os autores"
            />
          </div>
          <div className="grid gap-2">
            <Label>Editora</Label>
            <Input
              value={editora}
              onChange={(e) => setEditora(e.target.value)}
              placeholder="Digite a editora"
            />
          </div>
          <div className="grid gap-2">
            <Label>Ano de Publicação</Label>
            <Input
              value={anoPublicacao}
              onChange={(e) =>
                setAnoPublicacao(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Ex: 2024"
              maxLength={4}
            />
          </div>
          <div className="grid gap-2">
            <Label>Edição</Label>
            <Input
              value={edicao}
              onChange={(e) => setEdicao(e.target.value)}
              placeholder="Digite a edição"
            />
          </div>
          <div className="grid gap-2">
            <Label>Link Online</Label>
            <Input
              value={linkOnline}
              onChange={(e) => setLinkOnline(e.target.value)}
              placeholder="Digite o link"
            />
          </div>
          <div className="grid gap-2">
            <Label>Disponível</Label>
            <Select
              value={disponivel ? "true" : "false"}
              onValueChange={(value) => setDisponivel(value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
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
