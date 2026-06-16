import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function OrgStudents() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get('/users')
      .then((res) => setUsers(res.data.users))
      .catch((e) => toast.error(e.message));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-2 text-3xl font-bold">
        <Users className="icon-accent" /> Alunos da organização
      </h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-app text-left text-muted">
              <th className="p-3">Nome</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Papel</th>
              <th className="p-3">Nível</th>
              <th className="p-3">XP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-app">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.level}</td>
                <td className="p-3">{u.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
