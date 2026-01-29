'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shop,
  ShopFilters,
  ShopForm,
  queryKeys,
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Helper functions for shop operations
const fetchShops = async (filters: ShopFilters = {}): Promise<Shop[]> => {
  const params = new URLSearchParams();
  if (filters.includeInactive) params.append('includeInactive', 'true');
  if (filters.searchTerm) params.append('search', filters.searchTerm);

  const response = await fetch(`/api/admin/shops?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar lojas');
  }

  return response.json();
};

const createShop = async (data: ShopForm): Promise<Shop> => {
  const response = await fetch('/api/admin/shops', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar loja');
  }

  return response.json();
};

const updateShop = async (data: ShopForm & { id: string }): Promise<Shop> => {
  const response = await fetch('/api/admin/shops', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar loja');
  }

  return response.json();
};

const deleteShop = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/shops?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir loja');
  }
};

// Query hooks
export const useShops = (filters: ShopFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.shops, filters],
    queryFn: () => fetchShops(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useShop = (id: string) => {
  return useQuery({
    queryKey: queryKeys.shop(id),
    queryFn: async (): Promise<Shop> => {
      const response = await fetch(`/api/admin/shops?id=${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar loja');
      }

      const shops = await response.json();
      return shops[0]; // API returns array, get first item
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createShop,
    onMutate: async (newShop) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.shops });

      // Snapshot previous value
      const previousShops = queryClient.getQueryData<Shop[]>(queryKeys.shops);

      // Optimistically update to the new value
      queryClient.setQueryData<Shop[]>(queryKeys.shops, (old) => 
        old ? [{ ...newShop, id: 'temp-id', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...old] : []
      );

      // Return a context with the previous value
      return { previousShops };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousShops) {
        queryClient.setQueryData(queryKeys.shops, context.previousShops);
      }
      
      toast({
        title: "Erro ao criar loja",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Loja criada com sucesso",
        description: "A loja foi adicionada ao sistema.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.shops });
    },
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateShop,
    onMutate: async (updatedShop) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.shops });
      await queryClient.cancelQueries({ queryKey: queryKeys.shop(updatedShop.id) });

      // Snapshot previous values
      const previousShops = queryClient.getQueryData<Shop[]>(queryKeys.shops);
      const previousShop = queryClient.getQueryData<Shop>(queryKeys.shop(updatedShop.id));

      // Optimistically update to the new value
      queryClient.setQueryData<Shop[]>(queryKeys.shops, (old) =>
        old?.map((shop) =>
          shop.id === updatedShop.id ? { ...shop, ...updatedShop } : shop
        ) || []
      );

      queryClient.setQueryData<Shop>(queryKeys.shop(updatedShop.id), (old) =>
        old ? { ...old, ...updatedShop } : undefined
      );

      // Return a context with the previous values
      return { previousShops, previousShop };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousShops) {
        queryClient.setQueryData(queryKeys.shops, context.previousShops);
      }
      if (context?.previousShop) {
        queryClient.setQueryData(queryKeys.shop(variables.id), context.previousShop);
      }
      
      toast({
        title: "Erro ao atualizar loja",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Loja atualizada com sucesso",
        description: "As informações foram salvas.",
      });
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.shops });
      queryClient.invalidateQueries({ queryKey: queryKeys.shop(variables.id) });
    },
  });
};

export const useDeleteShop = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteShop,
    onSuccess: () => {
      toast({
        title: "Loja excluída com sucesso",
        description: "A loja foi removida do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir loja",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.shops });
    },
  });
};