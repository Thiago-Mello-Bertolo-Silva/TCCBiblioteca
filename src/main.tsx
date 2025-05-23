import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './styles/index.css';
import App from './App.tsx';
import Cadastro from './Cadastrar.tsx';
import Recuperacao from './Recuperacao';
import NovaSenha from './NovaSenha';
import { HomePage } from './pages/Home/HomePage.tsx';
import Layout from './components/Layout.tsx';
import UsuariosPage from './pages/WorkerPages/UsuariosPage.tsx';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider } from './contexts/themeContext';
import ConfiguracaoPage from "./pages/WorkerPages/ConfiguracaoPage"
import LivrosPage from "./pages/WorkerPages/LivrosPage"
import EmprestimosPage from "./pages/WorkerPages/EmprestimosPage"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/Cadastrar" element={<Cadastro />} />
            <Route path="/Recuperacao" element={<Recuperacao />} />
            <Route path="/nova-senha/:token" element={<NovaSenha />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/Usuarios" element={<UsuariosPage />} />
              <Route path="/Livros" element={<LivrosPage />} />
              <Route path="/Emprestimos" element={<EmprestimosPage />} />
              <Route path="/configuracoes" element={<ConfiguracaoPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
