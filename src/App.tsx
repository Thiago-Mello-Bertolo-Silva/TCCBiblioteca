import { Routes, Route, useLocation } from 'react-router-dom';
import nuvemBibliotecaLogo from './assets/nuvemBiblioteca1.png';
import './styles/App.css';
import LoginForm from './components/loginForm';
import { AuthProvider } from './contexts/authContext';

export default function App() {
  const location = useLocation();
  const successMessage = location.state?.message;

  return (
    <AuthProvider>
      <Routes>
        {/* Rota padrão: tela de login */}
        <Route
          path="/"
          element={
            <div
              className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://images.squarespace-cdn.com/content/v1/5bb659ce77b9038cbe26abca/1550769249425-TEN6HIBV3ALNCN1TH3EE/140505_BIBLIOTECAestadual-024.jpg)'
              }}
            >
              <div className="w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
                <div className="flex flex-col items-center gap-6">
                  <img
                    src={nuvemBibliotecaLogo}
                    alt="Nuvem Biblioteca Logo"
                    className="h-26 w-auto opacity-90"
                  />

                  {/* Mensagem de sucesso */}
                  {successMessage && (
                    <div className="w-full bg-blue-400 text-white px-4 py-2 rounded-lg text-center text-sm font-medium shadow-lg">
                      {successMessage}
                    </div>
                  )}

                  {/* Formulário de Login */}
                  <LoginForm />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
