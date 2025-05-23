import { UserInfoForm } from "@/components/config/UserInfoForm"
import { PasswordForm } from "@/components/config/PasswordForm"
import { ThemeToggle } from "@/components/config/ThemeToggle"

const ConfiguracaoPage = () => {
  return (
    <div className="max-w-2xl ml-64 p-6 space-y-8">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="space-y-6">
        <UserInfoForm />
        <PasswordForm />
        <div>
          <h2 className="text-lg font-semibold mb-2">Preferências</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default ConfiguracaoPage
