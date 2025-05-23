import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const PasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Função futura para atualizar a senha
    console.log("Senha atual:", currentPassword, "Nova senha:", newPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Alterar Senha</h2>
      <Input
        type="password"
        placeholder="Senha atual"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button type="submit">Atualizar senha</Button>
    </form>
  )
}
