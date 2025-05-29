import nuvemBibliotecaLogo from './assets/nuvemBiblioteca.png';
import NovaSenhaForm from './components/NovaSenhaForm';

export default function NovaSenha() {


  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      {/* Lado esquerdo com imagem de fundo */}
      <div
        className="hidden md:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://img.freepik.com/free-photo/stack-books-with-library-scene_91128-4301.jpg?semt=ais_hybrid)'
        }}
      ></div>

      {/* Lado direito com formulário */}
      <div className="flex flex-col justify-between items-center bg-white px-8 py-12 shadow-md">
        <div className="flex flex-col items-center w-full max-w-md">
          <img
            src={nuvemBibliotecaLogo}
            alt="Nuvem Biblioteca Logo"
            className="mb-8 h-16 w-auto object-contain"
          />

          <h2 className="text-2xl font-bold text-center mb-4">Nova Senha</h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            Insira abaixo sua nova senha para acessar sua conta.
          </p>

          {/* Componente com os campos de redefinição de senha */}
          <NovaSenhaForm />
        </div>

        {/* Rodapé */}
      </div>
    </div>
  );
}
