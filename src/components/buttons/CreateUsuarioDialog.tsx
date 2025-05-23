// src/components/buttons/CreateUsuarioDialog.tsx
import { useState } from "react";
import { Dialog, DialogDescription, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateUsuarioDialogProps {
  onUsuarioCriado: () => void;
}

export function CreateUsuarioDialog({ onUsuarioCriado }: CreateUsuarioDialogProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("usuario");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const isFormValid = nome.trim() !== "" && email.trim() !== "" && telefone.trim() !== "" && senha.trim() !== "" && cargo.trim() !== "";

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

    if (value.length > 11) {
      value = value.slice(0, 11); // Limita a 11 números
    }

    if (value.length >= 2 && value.length <= 6) {
      value = `(${value.slice(0, 2)})${value.slice(2)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7)}`;
    }

    setTelefone(value);
  };

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, senha, cargo }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      setNome("");
      setEmail("");
      setTelefone("");
      setSenha("");
      setCargo("usuario");
      setOpen(false);
      onUsuarioCriado();
    } catch (err: any) {
      setErro(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cadastrar Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
        <DialogTitle>Novo Usuário</DialogTitle>
        <DialogDescription>Preencha as informações para cadastrar um novo usuário.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite o email" type="email" />
          </div>
          <div className="grid gap-2">
            <Label>Telefone</Label>
            <Input value={telefone} onChange={handleTelefoneChange} placeholder="(00)00000-0000" />
          </div>
          <div className="grid gap-2">
            <Label>Senha</Label>
            <Input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite a senha" type="password" />
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
