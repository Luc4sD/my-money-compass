import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Palette, Download, Trash2 } from 'lucide-react';

export default function Settings() {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div><h1 className="text-3xl font-bold">Configurações</h1><p className="text-muted-foreground">Personalize sua experiência</p></div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><User className="h-5 w-5" /><h2 className="text-lg font-semibold">Perfil</h2></div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Nome</Label><Input defaultValue="João Silva" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="joao@email.com" type="email" /></div>
            </div>
            <Button>Salvar Alterações</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Bell className="h-5 w-5" /><h2 className="text-lg font-semibold">Notificações</h2></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">Alertas de orçamento</p><p className="text-sm text-muted-foreground">Receba avisos ao atingir limites</p></div><Switch defaultChecked /></div>
            <Separator />
            <div className="flex items-center justify-between"><div><p className="font-medium">Contas a vencer</p><p className="text-sm text-muted-foreground">Lembretes de vencimento</p></div><Switch defaultChecked /></div>
            <Separator />
            <div className="flex items-center justify-between"><div><p className="font-medium">Resumo semanal</p><p className="text-sm text-muted-foreground">Email com resumo das finanças</p></div><Switch /></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Palette className="h-5 w-5" /><h2 className="text-lg font-semibold">Aparência</h2></div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Tema</Label><Select defaultValue="system"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem><SelectItem value="system">Sistema</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Moeda padrão</Label><Select defaultValue="brl"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="brl">Real (R$)</SelectItem><SelectItem value="usd">Dólar ($)</SelectItem><SelectItem value="eur">Euro (€)</SelectItem></SelectContent></Select></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Shield className="h-5 w-5" /><h2 className="text-lg font-semibold">Segurança</h2></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">Bloqueio por PIN</p><p className="text-sm text-muted-foreground">Proteção adicional ao abrir o app</p></div><Switch /></div>
            <Button variant="outline">Alterar Senha</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4"><Download className="h-5 w-5" /><h2 className="text-lg font-semibold">Dados</h2></div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar Dados</Button>
            <Button variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" />Excluir Conta</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
