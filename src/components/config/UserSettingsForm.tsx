import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/authContext';

export default function UserSettingsForm() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    senha: '',
    novaImagem: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'novaImagem' && files) {
      setFormData({ ...formData, novaImagem: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    alert("Usuário não autenticado.");
    return;
  }

    try {
      // Atualiza informações básicas
      await axios.put(`http://localhost:3000/usuarios/${user.id}`, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
      });


      alert('Dados atualizados com sucesso!');
      // Opcional: atualizar o estado do usuário global
      setUser({ ...user, nome: formData.nome, email: formData.email, telefone: formData.telefone });

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar seus dados.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md">
      <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" />
      <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Nova senha" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar Alterações</button>
    </form>
  );
}
