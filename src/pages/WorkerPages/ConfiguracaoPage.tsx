import { UserInfoForm } from "@/components/config/UserInfoForm";
import { PasswordForm } from "@/components/config/PasswordForm";
import { ThemeToggle } from "@/components/config/ThemeToggle";

const ConfiguracaoPage = () => {
  return (
    <div className="flex flex-col  overflow-auto px-106 py-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="space-y-6 max-w-2xl">
        <UserInfoForm />
        <PasswordForm />
        <div>
          <h2 className="text-lg font-semibold mb-2">Preferências</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default ConfiguracaoPage;
