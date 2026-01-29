"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, ShoppingCart, Store } from 'lucide-react';
import {
  useShops,
  usePurchases,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
  useCreatePurchase,
  useUpdatePurchase,
  useDeletePurchase,
} from '@/hooks/api';
import { Shop, Purchase, ShopForm, PurchaseForm } from '@/types/api';

const shopSchema = z.object({
  name: z.string().min(1, 'Nome da loja é obrigatório'),
  contact: z.string().optional()
});

const purchaseSchema = z.object({
  shopId: z.string().min(1, 'Loja é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  items: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  receiptUrl: z.string().optional(),
  notes: z.string().optional()
});

export function ShopsTab() {
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeView, setActiveView] = useState<'shops' | 'purchases'>('shops');

  // Use TanStack Query for data fetching
  const { data: shops = [], isLoading: shopsLoading } = useShops({ includeInactive: false });
  const { data: purchases = [], isLoading: purchasesLoading } = usePurchases({});
  
  const createShopMutation = useCreateShop();
  const updateShopMutation = useUpdateShop();
  const deleteShopMutation = useDeleteShop();
  const createPurchaseMutation = useCreatePurchase();
  const updatePurchaseMutation = useUpdatePurchase();
  const deletePurchaseMutation = useDeletePurchase();

  const shopForm = useForm<ShopForm>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      contact: ''
    }
  });

  const purchaseForm = useForm<PurchaseForm>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      shopId: '',
      amount: '',
      items: '',
      date: new Date().toISOString().split('T')[0],
      receiptUrl: '',
      notes: ''
    }
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        purchaseForm.setValue('receiptUrl', data.url);
        return data.url;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const onSubmitShop = async (data: ShopForm) => {
    try {
      const url = editingShop ? '/api/admin/shops' : '/api/admin/shops';
      const method = editingShop ? 'PUT' : 'POST';
      
      const payload = { ...data };
      if (editingShop) {
        (payload as any).id = editingShop.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShopDialogOpen(false);
        setEditingShop(null);
        shopForm.reset();
        // Data will be automatically refetched by TanStack Query
      }
    } catch (error) {
      console.error('Error saving shop:', error);
    }
  };

  const onSubmitPurchase = async (data: PurchaseForm) => {
    try {
      const url = editingPurchase ? '/api/admin/purchases' : '/api/admin/purchases';
      const method = editingPurchase ? 'PUT' : 'POST';
      
      const payload = { ...data };
      if (editingPurchase) {
        (payload as any).id = editingPurchase.id;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setPurchaseDialogOpen(false);
        setEditingPurchase(null);
        purchaseForm.reset();
        // Data will be automatically refetched by TanStack Query
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  const handleEditShop = (shop: Shop) => {
    setEditingShop(shop);
    shopForm.reset({
      name: shop.name,
      contact: shop.contact || ''
    });
    setShopDialogOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    purchaseForm.reset({
      shopId: purchase.shopId,
      amount: purchase.amount,
      items: purchase.items || '',
      date: purchase.date.split('T')[0],
      receiptUrl: purchase.receiptUrl || '',
      notes: purchase.notes || ''
    });
    setPurchaseDialogOpen(true);
  };

  const handleDeleteShop = async (id: string) => {
    if (confirm('Tem certeza que deseja desativar esta loja?')) {
      try {
        const response = await fetch(`/api/admin/shops?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Data will be automatically refetched by TanStack Query
        }
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  const handleDeletePurchase = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta compra?')) {
      try {
        const response = await fetch(`/api/admin/purchases?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Data will be automatically refetched by TanStack Query
        }
      } catch (error) {
        console.error('Error deleting purchase:', error);
      }
    }
  };

  const calculateTotalPurchases = () => {
    return purchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0).toFixed(2);
  };

  if (shopsLoading || purchasesLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Lojas e Compras</h2>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'shops' ? 'default' : 'outline'}
            onClick={() => setActiveView('shops')}
          >
            <Store className="w-4 h-4 mr-2" />
            Lojas
          </Button>
          <Button
            variant={activeView === 'purchases' ? 'default' : 'outline'}
            onClick={() => setActiveView('purchases')}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Compras
          </Button>
        </div>
      </div>

      {activeView === 'shops' ? (
        <>
          <div className="flex justify-end">
            <Dialog open={shopDialogOpen} onOpenChange={setShopDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingShop(null); shopForm.reset(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Loja
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingShop ? 'Editar Loja' : 'Nova Loja'}</DialogTitle>
                  <DialogDescription>Preencha as informações da loja</DialogDescription>
                </DialogHeader>
                <Form {...shopForm}>
                  <form onSubmit={shopForm.handleSubmit(onSubmitShop)} className="space-y-4">
                    <FormField
                      control={shopForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Loja</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da loja" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopForm.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contato (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Telefone, email, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingShop ? 'Atualizar' : 'Salvar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShopDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lojas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shops.map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{shop.name}</div>
                      {shop.contact && (
                        <div className="text-sm text-gray-600">{shop.contact}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        {shop.purchases?.length || 0} compras
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditShop(shop)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteShop(shop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {shops.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma loja encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total: R$ {calculateTotalPurchases()}
            </div>
            <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingPurchase(null); purchaseForm.reset(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Compra
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingPurchase ? 'Editar Compra' : 'Nova Compra'}</DialogTitle>
                  <DialogDescription>Preencha as informações da compra</DialogDescription>
                </DialogHeader>
                <Form {...purchaseForm}>
                  <form onSubmit={purchaseForm.handleSubmit(onSubmitPurchase)} className="space-y-4">
                    <FormField
                      control={purchaseForm.control}
                      name="shopId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loja</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma loja" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {shops.filter(shop => shop.isActive).map((shop) => (
                                <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={purchaseForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={purchaseForm.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Itens comprados</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Lista de itens comprados" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={purchaseForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={purchaseForm.control}
                      name="receiptUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprovante</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file);
                                }}
                                disabled={uploading}
                              />
                              {field.value && (
                                <a
                                  href={field.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3" />
                                  Ver comprovante
                                </a>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={purchaseForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Observações (opcional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={uploading}>
                        {editingPurchase ? 'Atualizar' : 'Salvar'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPurchaseDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{purchase.shop?.name || 'Loja não encontrada'}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(purchase.date).toLocaleDateString('pt-BR')} • 
                        R$ {parseFloat(purchase.amount).toFixed(2)}
                      </div>
                      {purchase.items && (
                        <div className="text-sm text-gray-500 mt-1">{purchase.items}</div>
                      )}
                      {purchase.notes && (
                        <div className="text-sm text-gray-500 mt-1">{purchase.notes}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {purchase.receiptUrl && (
                        <a
                          href={purchase.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPurchase(purchase)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePurchase(purchase.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {purchases.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma compra encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}