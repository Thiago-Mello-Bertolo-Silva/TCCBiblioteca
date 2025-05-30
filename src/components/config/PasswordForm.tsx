import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Senha atual:", currentPassword, "Nova senha:", newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-4">Alterar Senha</h2>

      <div className="flex flex-col gap-4">
        <div className="relative flex items-center gap-3 px-4 py-2 rounded-lg border border-green-600">
          <Input
            type="password"
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
          />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-2 rounded-lg border border-green-600">
          <Input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-transparent border-none text-green-800 w-full placeholder-green-800 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-md"
        >
          Atualizar senha
        </Button>
      </div>
    </form>
  );
};
