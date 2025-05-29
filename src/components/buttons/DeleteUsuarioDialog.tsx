// src/components/buttons/DeleteUsuarioDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Usuario } from "@/hooks/useUsuariosColumns";
import { useAuth } from "@/contexts/authContext"; 

interface DeleteUsuarioDialogProps {
  selectedUser: Usuario | null;
  onUserDeleted: () => void;
}

export function DeleteUsuarioDialog({ selectedUser, onUserDeleted }: DeleteUsuarioDialogProps) {
  const { user } = useAuth(); 
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:3000/usuario/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUserDeleted();
        setOpen(false);
      } else {
        console.error("Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Erro ao enviar requisição de deleção:", error);
    }
  };

  // ⚠️ Apenas admins podem ver o botão
  if (user?.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={!selectedUser}>
          Deletar Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deletar Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o usuário <strong>{selectedUser?.nome}</strong>? Esta ação não pode ser desfeita.
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
