// src/components/buttons/DeleteEmprestimosDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Emprestimo } from "@/hooks/useEmprestimosColumns";
import { useAuth } from "@/contexts/authContext"; 

interface DeleteEmprestimosDialogProps {
  selectedEmprestimo: Emprestimo | null;
  onEmprestimoDeleted: () => void;
}

export function DeleteEmprestimosDialog({ selectedEmprestimo, onEmprestimoDeleted }: DeleteEmprestimosDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth(); // Pega o usuário logado

  const handleDelete = async () => {
    if (!selectedEmprestimo) return;

    try {
      const response = await fetch(`http://localhost:3000/emprestimo/${selectedEmprestimo.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onEmprestimoDeleted();
        setOpen(false);
      } else {
        console.error("Erro ao deletar empréstimo");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de deleção:", error);
    }
  };

  // Só renderiza o botão se o usuário for admin
  if (user?.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={!selectedEmprestimo}>
          Deletar Empréstimo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deletar Empréstimo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o empréstimo de <strong>{selectedEmprestimo?.nomeUsuario}</strong>? Esta ação não pode ser desfeita.
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
