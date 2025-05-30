import nuvemBibliotecaLogo from './assets/nuvemBiblioteca1.png';
import bibliotecaBg from './assets/bibliotecaBg.png';
import CadastroForm from './components/cadastroForm';

export default function Cadastro() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bibliotecaBg})` }}
    >
      <div className="w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <div className="flex flex-col items-center gap-6">
          <img
            src={nuvemBibliotecaLogo}
            alt="Nuvem Biblioteca Logo"
            className="h-26 w-auto opacity-90"
          />

          {/* Formulário de Cadastro */}
          <CadastroForm />
        </div>
      </div>
    </div>
  );
}
