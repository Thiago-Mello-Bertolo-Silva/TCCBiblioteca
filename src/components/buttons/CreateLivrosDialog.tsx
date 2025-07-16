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
import { livroSchema, LivroFormData } from "@/schemas/createLivroSchema";

interface CreateLivrosDialogProps {
  onLivroCreate: () => void;
}

export function CreateLivrosDialog({ onLivroCreate }: CreateLivrosDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LivroFormData>({
    resolver: zodResolver(livroSchema),
    defaultValues: {
      titulo: "",
      autores: "",
      editora: "",
      anoPublicacao: "",
      edicao: "",
      linkOnline: "",
      disponivel: "true",
    },
  });

  const disponivel = watch("disponivel");

  const onSubmit = async (data: LivroFormData) => {
    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKENDURL}/livro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          anoPublicacao: Number(data.anoPublicacao),
          disponivel: data.disponivel === "true" ? "Sim" : "Não",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar livro");
      }

      reset();
      setOpen(false);
      onLivroCreate();
    } catch (err: any) {
      setErro(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input placeholder="Digite o título" {...register("titulo")} />
            {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Autores</Label>
            <Input placeholder="Digite os autores" {...register("autores")} />
            {errors.autores && <p className="text-red-500 text-sm">{errors.autores.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Editora</Label>
            <Input placeholder="Digite a editora" {...register("editora")} />
            {errors.editora && <p className="text-red-500 text-sm">{errors.editora.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Ano de Publicação</Label>
            <Input
              placeholder="Ex: 2024"
              maxLength={4}
              {...register("anoPublicacao")}
              onInput={(e) =>
                setValue("anoPublicacao", e.currentTarget.value.replace(/\D/g, ""))
              }
            />
            {errors.anoPublicacao && (
              <p className="text-red-500 text-sm">{errors.anoPublicacao.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Edição</Label>
            <Input placeholder="Digite a edição" {...register("edicao")} />
            {errors.edicao && <p className="text-red-500 text-sm">{errors.edicao.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Link Online</Label>
            <Input placeholder="Digite o link" {...register("linkOnline")} />
            {errors.linkOnline && (
              <p className="text-red-500 text-sm">{errors.linkOnline.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Disponível</Label>
            <Select
              value={disponivel}
              onValueChange={(value: "true" | "false") => setValue("disponivel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
            {errors.disponivel && (
              <p className="text-red-500 text-sm">{errors.disponivel.message}</p>
            )}
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
