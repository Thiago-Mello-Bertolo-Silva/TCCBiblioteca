import nuvemBibliotecaLogo from './assets/nuvemBiblioteca.png';
import bibliotecaBg from './assets/bibliotecaBg.png';
import CadastroForm from './components/cadastroForm';

export default function Cadastro() {

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      <div
        className="hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bibliotecaBg})` }}
      ></div>

      <div className="flex flex-col justify-between items-center bg-white px-8 py-12 shadow-md">
        <div className="flex flex-col items-center w-full max-w-md">
          <img src={nuvemBibliotecaLogo} alt="Nuvem Biblioteca Logo" className="mb-8 h-16 w-auto object-contain" />
          <CadastroForm />
        </div>

      </div>
    </div>
  );
}
