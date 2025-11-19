import { useState } from "react";
import { Dialog, DialogContent,  DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Livro } from "@/hooks/useLivrosColumns";
import { useAuth } from "@/contexts/authContext"; 

interface EditLivroDialogProps {
  selectedLivro: Livro | null;
  onLivroUpdated: () => void;
}

export function EditLivrosDialog({ selectedLivro, onLivroUpdated }: EditLivroDialogProps) {
  const { user } = useAuth(); 
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [categorias, setCategorias] = useState("");
  const [autores, setAutores] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [editora, setEditora] = useState("");
  const [linkOnline, setLinkOnline] = useState("");
  const [disponivel, setDisponivel] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && selectedLivro) {
      setTitulo(selectedLivro.titulo);
      setCategorias(selectedLivro.categorias);
      setAutores(selectedLivro.autores);
      setAnoPublicacao(selectedLivro.anoPublicacao.toString());
      setEditora(selectedLivro.editora || "");
      setLinkOnline(selectedLivro.linkOnline || "");
      setDisponivel(selectedLivro.disponivel === "Sim");
    }
  };

  const handleSubmit = async () => {
    if (!selectedLivro) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livro/${selectedLivro.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          categorias,
          autores,
          anoPublicacao: parseInt(anoPublicacao, 10),
          editora,
          linkOnline,
          disponivel: disponivel ? "Sim" : "Não",
        }),
      });

      if (response.ok) {
        onLivroUpdated();
        setOpen(false);
      } else {
        console.error("Erro ao atualizar livro");
      }
    } catch (error) {
      console.error("Erro ao enviar atualização:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {user?.cargo === "admin" && ( // 👈 Só mostra o botão para admin
        <DialogTrigger asChild>
          <Button disabled={!selectedLivro}>Editar Livro</Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Livro</DialogTitle>
          <DialogDescription>
            Altere as informações desejadas e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Categorias</Label>
            <Input
              placeholder="Categorias"
              value={categorias}
              onChange={(e) => setCategorias(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Autores</Label>
            <Input
              placeholder="Autores"
              value={autores}
              onChange={(e) => setAutores(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Ano de Publicação</Label>
            <Input
              placeholder="Ano de Publicação"
              value={anoPublicacao}
              onChange={(e) =>
                setAnoPublicacao(e.target.value.replace(/\D/g, ""))
              }
              maxLength={4}
            />
          </div>
          <div className="grid gap-2">
            <Label>Editora</Label>
            <Input
              placeholder="Editora"
              value={editora}
              onChange={(e) => setEditora(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Link Online (opcional)</Label>
            <Input
              placeholder="https://exemplo.com"
              value={linkOnline}
              onChange={(e) => setLinkOnline(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Disponível</Label>
            <Select
              value={disponivel ? "Sim" : "Não"}
              onValueChange={(value) => setDisponivel(value === "Sim")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!titulo || !autores || !anoPublicacao}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
