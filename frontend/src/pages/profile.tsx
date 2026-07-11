import { useState, useEffect } from 'react';
import { User, Loader2, Save, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormAlert } from '@/components/shared/form-error';
import { ApiError } from '@/services/api';
import { apiClient } from '@/services/api';
import useAuthStore from '@/hooks/useAuth';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      apiClient.get('/users/me').then((r: any) => {
        setProfile({ name: r.name ?? '', email: r.email ?? '', phone: r.phone ?? '', role: r.role ?? '' });
      }).catch(() => {});
    }
  }, [user]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    setSaving(true);
    try {
      await apiClient.patch('/users/me', { name: profile.name, phone: profile.phone || undefined });
      setSuccess('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err instanceof ApiError ? err.messages : ['Erro ao salvar perfil.']);
    }
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(['As senhas não conferem.']);
      return;
    }
    setChangingPwd(true);
    try {
      await apiClient.patch('/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess('Senha alterada com sucesso.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err instanceof ApiError ? err.messages : ['Erro ao alterar senha.']);
    }
    setChangingPwd(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      {success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}
      <FormAlert messages={error ?? []} />

      <Card>
        <CardHeader><CardTitle className="text-base">Dados Pessoais</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nome</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Email</Label><Input value={profile.email} disabled className="bg-muted" /></div>
              <div className="space-y-1"><Label>Telefone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="(11) 99999-9999" /></div>
              <div className="space-y-1"><Label>Função</Label><Input value={profile.role} disabled className="bg-muted" /></div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Alterar Senha</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1"><Label>Senha Atual</Label><Input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nova Senha</Label><Input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} /></div>
              <div className="space-y-1"><Label>Confirmar Senha</Label><Input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required /></div>
            </div>
            <Button type="submit" disabled={changingPwd}>
              {changingPwd && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Lock className="mr-2 h-4 w-4" /> Alterar Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
