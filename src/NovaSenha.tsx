import nuvemBibliotecaLogo from './assets/nuvemBiblioteca1.png';
import NovaSenhaForm from './components/NovaSenhaForm';

export default function NovaSenha() {
  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://img.freepik.com/free-photo/stack-books-with-library-scene_91128-4301.jpg?semt=ais_hybrid)'
      }}
    >
      <div className="w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <div className="flex flex-col items-center gap-6">
          <img
            src={nuvemBibliotecaLogo}
            alt="Nuvem Biblioteca Logo"
            className="h-26 w-auto opacity-90"
          />

          {/* Formulário de Redefinição de Senha */}
          <NovaSenhaForm />
        </div>
      </div>
    </div>
  );
}
