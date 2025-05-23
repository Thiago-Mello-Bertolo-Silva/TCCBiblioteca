import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/ui/footer';
import nuvemBibliotecaLogo from './assets/nuvemBiblioteca.png';
import './styles/App.css';
import LoginForm from './components/loginForm';
import { AuthProvider } from './contexts/authContext';

export default function App() {
  const location = useLocation();
  const successMessage = location.state?.message;

  const policyLinks = [
    { name: 'Cookie Policy', url: '/cookie-policy' },
    { name: 'Cookie Preferences', url: '/cookie-preferences' }
  ];

  return (
    <AuthProvider>
      <Routes>
        {/* Rota padrão: tela de login */}
        <Route
          path="/"
          element={
            <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
              {/* Lado esquerdo com imagem de fundo */}
              <div
                className="hidden md:block bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url(https://media.gazetadopovo.com.br/2016/05/e6e48ff71c621a0b61e39025ecdd3912-gpMedium.jpg)'
                }}
              ></div>

              {/* Lado direito com conteúdo do login */}
              <div className="flex items-center justify-center bg-white px-8 shadow-md">
                <div className="flex flex-col justify-between items-center w-full max-w-md h-full py-12">
                  <div className="flex flex-col items-center w-full">
                    <img
                      src={nuvemBibliotecaLogo}
                      alt="Nuvem Biblioteca Logo"
                      className="mb-8 h-16 w-auto object-contain"
                    />

                    {/* Mensagem de sucesso */}
                    {successMessage && (
                      <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-center text-sm">
                        {successMessage}
                      </div>
                    )}

                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                    {/* Login real com conexão ao backend */}
                    <LoginForm />
                  </div>

                  <Footer socialLinks={[]} policyLinks={policyLinks} />
                </div>
              </div>
            </div>
          }
        />

        {/* Rota para redefinir senha com token */}
      </Routes>
    </AuthProvider>
  );
}
