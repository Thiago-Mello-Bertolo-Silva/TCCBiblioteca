import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/index.css';

import App from './App.tsx';
import Cadastro from './Cadastrar.tsx';
import Recuperacao from './Recuperacao';
import NovaSenha from './NovaSenha';
import LoadUserPage from './pages/Home/LoadUserPage.tsx';
import { HomePage } from './pages/Home/HomePage.tsx';
import { WelcomePage } from './pages/Home/WelcomePage.tsx';
import Layout from './components/Layout.tsx';
import UsuariosPage from './pages/WorkerPages/UsuariosPage.tsx';
import MeusLivros from './pages/WorkerPages/MeusLivrosPage.tsx';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider } from './contexts/themeContext';
import ConfiguracaoPage from './pages/WorkerPages/ConfiguracaoPage.tsx';
import LivrosPage from './pages/WorkerPages/LivrosPage.tsx';
import EmprestimosPage from './pages/WorkerPages/EmprestimosPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificacoesPage } from './pages/WorkerPages/NotificacoesPage.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <QueryClientProvider client={queryClient}>  
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<App />} />
              <Route path="/Cadastrar" element={<Cadastro />} />
              <Route path="/Recuperacao" element={<Recuperacao />} />
              <Route path="/nova-senha/:token" element={<NovaSenha />} />
              <Route path="/load-user" element={<LoadUserPage />} />

              {/* Rotas protegidas com layout compartilhado */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/Welcome" element={<WelcomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/Usuarios" element={<UsuariosPage />} />
                <Route path="/Livros" element={<LivrosPage />} />
                <Route path="/MeusLivros" element={<MeusLivros />} />
                <Route path="/Emprestimos" element={<EmprestimosPage />} />
                <Route path="/configuracoes" element={<ConfiguracaoPage />} />
                <Route path="/Notificacoes" element={<NotificacoesPage />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
