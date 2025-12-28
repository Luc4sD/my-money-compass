import { AppLayout } from '@/components/layout/AppLayout';
import { tags } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MoreHorizontal, Tag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Tags() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Tags</h1><p className="text-muted-foreground">Etiquetas para organização transversal</p></div>
          <Button className="gap-2"><Plus className="h-4 w-4" />Nova Tag</Button>
        </div>

        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tag.color}20` }}>
                    <Tag className="h-5 w-5" style={{ color: tag.color }} />
                  </div>
                  <div>
                    <p className="font-medium">{tag.name}</p>
                    <p className="text-sm text-muted-foreground">0 transações</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
