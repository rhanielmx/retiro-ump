'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Purchase,
  PurchaseFilters,
  PurchaseForm,
  queryKeys,
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Helper functions for purchase operations
const fetchPurchases = async (filters: PurchaseFilters = {}): Promise<Purchase[]> => {
  const params = new URLSearchParams();
  if (filters.shopId && filters.shopId !== 'all') params.append('shopId', filters.shopId);
  if (filters.dateFrom) params.append('startDate', filters.dateFrom);
  if (filters.dateTo) params.append('endDate', filters.dateTo);
  if (filters.searchTerm) params.append('search', filters.searchTerm);

  const response = await fetch(`/api/admin/purchases?${params}`);

  if (!response.ok) {
    let errorMessage = 'Erro ao buscar compras';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const createPurchase = async (data: PurchaseForm): Promise<Purchase> => {
  const response = await fetch('/api/admin/purchases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao criar compra';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const updatePurchase = async (data: PurchaseForm & { id: string }): Promise<Purchase> => {
  const response = await fetch('/api/admin/purchases', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao atualizar compra';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const deletePurchase = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/purchases?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao excluir compra';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }
};

// Query hooks
export const usePurchases = (filters: PurchaseFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.purchases, filters],
    queryFn: () => fetchPurchases(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: queryKeys.purchase(id),
    queryFn: async (): Promise<Purchase> => {
      const response = await fetch(`/api/admin/purchases?id=${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar compra');
      }

      const purchases = await response.json();
      return purchases[0]; // API returns array, get first item
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createPurchase,
    onMutate: async (newPurchase) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.purchases });

      // Snapshot previous value
      const previousPurchases = queryClient.getQueryData<Purchase[]>(queryKeys.purchases);

      // Optimistically update to the new value
      queryClient.setQueryData<Purchase[]>(queryKeys.purchases, (old) => 
        old ? [{ ...newPurchase, id: 'temp-id', createdAt: new Date().toISOString() }, ...old] : []
      );

      // Return a context with the previous value
      return { previousPurchases };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPurchases) {
        queryClient.setQueryData(queryKeys.purchases, context.previousPurchases);
      }
      
      toast({
        title: "Erro ao criar compra",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Compra criada com sucesso",
        description: "A compra foi registrada no sistema.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updatePurchase,
    onMutate: async (updatedPurchase) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.purchases });
      await queryClient.cancelQueries({ queryKey: queryKeys.purchase(updatedPurchase.id) });

      // Snapshot previous values
      const previousPurchases = queryClient.getQueryData<Purchase[]>(queryKeys.purchases);
      const previousPurchase = queryClient.getQueryData<Purchase>(queryKeys.purchase(updatedPurchase.id));

      // Optimistically update to the new value
      queryClient.setQueryData<Purchase[]>(queryKeys.purchases, (old) =>
        old?.map((purchase) =>
          purchase.id === updatedPurchase.id ? { ...purchase, ...updatedPurchase } : purchase
        ) || []
      );

      queryClient.setQueryData<Purchase>(queryKeys.purchase(updatedPurchase.id), (old) =>
        old ? { ...old, ...updatedPurchase } : undefined
      );

      // Return a context with the previous values
      return { previousPurchases, previousPurchase };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPurchases) {
        queryClient.setQueryData(queryKeys.purchases, context.previousPurchases);
      }
      if (context?.previousPurchase) {
        queryClient.setQueryData(queryKeys.purchase(variables.id), context.previousPurchase);
      }
      
      toast({
        title: "Erro ao atualizar compra",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Compra atualizada com sucesso",
        description: "As informações foram salvas.",
      });
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchase(variables.id) });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      toast({
        title: "Compra excluída com sucesso",
        description: "A compra foi removida do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir compra",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases });
    },
  });
};