import { useAuth } from "@/contexts/authContext";

export function WelcomePage() {
  const { user } = useAuth();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://en.vbackground.com/en/wp-content/uploads/2020/05/black_board.jpg)",
      }}
    >
      {/* 🟦 Mensagem de Boas-Vindas */}
      <div className="text-center bg-blue-50 px-10 py-6 rounded-xl shadow-lg mt-4">
        <h1 className="text-4xl font-extrabold text-blue-900">
          Bem-vindo de volta, {user?.nome?.split(" ")[0]}!
        </h1>
      </div>
    </div>
  );
}
