import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { categories } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronRight, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Categories() {
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const CategoryItem = ({ category, isSubcategory = false }: { category: typeof categories[0], isSubcategory?: boolean }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 group ${isSubcategory ? 'ml-8' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
        </div>
        <span className="font-medium">{category.name}</span>
        {category.subcategories && <Badge variant="secondary">{category.subcategories.length}</Badge>}
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
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Categorias</h1><p className="text-muted-foreground">Organize suas transações</p></div>
          <Button className="gap-2"><Plus className="h-4 w-4" />Nova Categoria</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-emerald-600">Receitas</h2>
            <div className="space-y-1">
              {incomeCategories.map(cat => <CategoryItem key={cat.id} category={cat} />)}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-rose-600">Despesas</h2>
            <div className="space-y-1">
              {expenseCategories.map(cat => (
                <div key={cat.id}>
                  <CategoryItem category={cat} />
                  {cat.subcategories?.map(sub => <CategoryItem key={sub.id} category={sub} isSubcategory />)}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
