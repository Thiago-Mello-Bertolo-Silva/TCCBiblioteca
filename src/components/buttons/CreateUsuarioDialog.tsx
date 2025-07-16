import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogDescription,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { usuarioSchema, UsuarioFormData } from "@/schemas/createUsuarioSchema";

interface CreateUsuarioDialogProps {
  onUsuarioCriado: () => void;
}

export function CreateUsuarioDialog({ onUsuarioCriado }: CreateUsuarioDialogProps) {
  const { user, isLoading } = useAuth();
  const [erro, setErro] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      cargo: "usuario",
    },
  });

  /** form submit */
  const onSubmit = async (data: UsuarioFormData) => {
    setErro("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao criar usuário");

      reset();
      setOpen(false);
      onUsuarioCriado();
    } catch (e: any) {
      setErro(e.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  /** máscara do telefone */
  const telefoneRaw = watch("telefone");
  function formatTelefone(v: string) {
    const n = v.replace(/\D/g, "").slice(0, 11);
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0, 2)})${n.slice(2)}`;
    return `(${n.slice(0, 2)})${n.slice(2, 7)}-${n.slice(7)}`;
  }

  // bloqueia todo o modal se não for admin
  if (isLoading || user?.cargo !== "admin") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cadastrar Novo Usuário</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações para cadastrar um novo usuário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* nome */}
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input placeholder="Digite o nome" {...register("nome")} />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
          </div>

          {/* email */}
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="E‑mail" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* telefone */}
          <div className="grid gap-2">
            <Label>Telefone</Label>
            <Input
              placeholder="(00)00000-0000"
              value={telefoneRaw}
              {...register("telefone")}
              onChange={(e) => setValue("telefone", formatTelefone(e.target.value))}
            />
            {errors.telefone && (
              <p className="text-red-500 text-sm">{errors.telefone.message}</p>
            )}
          </div>

          {/* senha */}
          <div className="grid gap-2">
            <Label>Senha</Label>
            <Input type="password" placeholder="Senha" {...register("senha")} />
            {errors.senha && <p className="text-red-500 text-sm">{errors.senha.message}</p>}
          </div>

          {/* cargo */}
          <div className="grid gap-2">
            <Label>Cargo</Label>
            <Select
              value={watch("cargo")}
              onValueChange={(v) => setValue("cargo", v as UsuarioFormData["cargo"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            {errors.cargo && <p className="text-red-500 text-sm">{errors.cargo.message}</p>}
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
