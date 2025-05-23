// src/components/buttons/EditUsuarioDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Usuario } from "@/hooks/useUsuariosColumns";

interface EditUsuarioDialogProps {
  selectedUser: Usuario | null;
  onUserUpdated: () => void;
}

export function EditUsuarioDialog({ selectedUser, onUserUpdated }: EditUsuarioDialogProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("usuario");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && selectedUser) {
      setNome(selectedUser.nome);
      setEmail(selectedUser.email);
      setTelefone(selectedUser.telefone);
      setSenha("");
      setCargo(selectedUser.cargo || "usuario");
    }
  };

  const formatTelefone = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value.length > 2 && value.length <= 7) {
      return `(${value.slice(0, 2)})${value.slice(2)}`;
    }
    if (value.length > 7) {
      return `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
    return value;
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:3000/usuario/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, senha: senha || undefined, cargo }),
      });

      if (response.ok) {
        onUserUpdated();
        setOpen(false);
      } else {
        console.error("Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Erro ao enviar atualização:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!selectedUser}>Editar Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Altere as informações desejadas e clique em salvar.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Telefone</Label>
            <Input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label>Nova Senha (opcional)</Label>
            <Input placeholder="Nova Senha (opcional)" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Cargo</Label>
            <Select value={cargo} onValueChange={setCargo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!nome || !email || !telefone || !cargo}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
