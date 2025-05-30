import nuvemBibliotecaLogo from './assets/nuvemBiblioteca1.png';
import RecuperacaoForm from './components/recuperacaoForm';

export default function Recuperacao() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://s2.glbimg.com/oa2VSk88ihiNf1fTa21RJbM9tWE=/smart/e.glbimg.com/og/ed/f/original/2020/07/07/biblioteca-ludica-em-escola-em-curitiba-1.jpg)'
      }}
    >
      <div className="w-full max-w-lg p-8 rounded-xl shadow-2xl bg-white/20 backdrop-blur-md border border-white/30">
        <div className="flex flex-col items-center gap-6">
          <img
            src={nuvemBibliotecaLogo}
            alt="Nuvem Biblioteca Logo"
            className="h-26 w-auto opacity-90"
          />

          {/* Formulário de Recuperação */}
          <RecuperacaoForm />
        </div>
      </div>
    </div>
  );
}
