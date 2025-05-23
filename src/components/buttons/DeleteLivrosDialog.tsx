// src/components/buttons/DeleteLivrosDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Livro } from "@/hooks/useLivrosColumns";

interface DeleteLivrosDialogProps {
  selectedLivro: Livro | null;
  onLivroDeleted: () => void;
}

export function DeleteLivrosDialog({ selectedLivro, onLivroDeleted }: DeleteLivrosDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleDelete = async () => {
    if (!selectedLivro) return;

    try {
      const response = await fetch(`http://localhost:3000/livro/${selectedLivro.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onLivroDeleted();
        setOpen(false);
      } else {
        console.error("Erro ao deletar livro");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de deleção:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={!selectedLivro}>
          Deletar Livro
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deletar Livro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o livro <strong>{selectedLivro?.titulo}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
