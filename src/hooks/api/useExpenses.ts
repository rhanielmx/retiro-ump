'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Expense,
  ExpenseFilters,
  ExpenseForm,
  ExpenseCategory,
  queryKeys,
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Helper functions for expense operations
const fetchExpenses = async (filters: ExpenseFilters = {}): Promise<Expense[]> => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.dateFrom) params.append('startDate', filters.dateFrom);
  if (filters.dateTo) params.append('endDate', filters.dateTo);
  if (filters.searchTerm) params.append('search', filters.searchTerm);

  const response = await fetch(`/api/admin/expenses?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao buscar despesas');
  }

  return response.json();
};

const createExpense = async (data: ExpenseForm): Promise<Expense> => {
  const response = await fetch('/api/admin/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar despesa');
  }

  return response.json();
};

const updateExpense = async (data: ExpenseForm & { id: string }): Promise<Expense> => {
  const response = await fetch('/api/admin/expenses', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar despesa');
  }

  return response.json();
};

const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/expenses?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir despesa');
  }
};

// Query hooks
export const useExpenses = (filters: ExpenseFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.expenses, filters],
    queryFn: () => fetchExpenses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: async (): Promise<Expense> => {
      const response = await fetch(`/api/admin/expenses?id=${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar despesa');
      }

      const expenses = await response.json();
      return expenses[0]; // API returns array, get first item
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createExpense,
    onMutate: async (newExpense) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.expenses });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData<Expense[]>(queryKeys.expenses);

      // Optimistically update to the new value
      queryClient.setQueryData<Expense[]>(queryKeys.expenses, (old) => 
        old ? [{ 
          ...newExpense, 
          id: 'temp-id', 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString(),
          category: newExpense.category || ExpenseCategory.OTHER
        }, ...old] : []
      );

      // Return a context with the previous value
      return { previousExpenses };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousExpenses) {
        queryClient.setQueryData(queryKeys.expenses, context.previousExpenses);
      }
      
      toast({
        title: "Erro ao criar despesa",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Despesa criada com sucesso",
        description: "A despesa foi registrada no sistema.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateExpense,
    onMutate: async (updatedExpense) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.expenses });
      await queryClient.cancelQueries({ queryKey: queryKeys.expense(updatedExpense.id) });

      // Snapshot previous values
      const previousExpenses = queryClient.getQueryData<Expense[]>(queryKeys.expenses);
      const previousExpense = queryClient.getQueryData<Expense>(queryKeys.expense(updatedExpense.id));

      // Optimistically update to the new value
      queryClient.setQueryData<Expense[]>(queryKeys.expenses, (old) =>
        old?.map((expense) =>
          expense.id === updatedExpense.id ? { ...expense, ...updatedExpense } : expense
        ) || []
      );

      queryClient.setQueryData<Expense>(queryKeys.expense(updatedExpense.id), (old) =>
        old ? { ...old, ...updatedExpense } : undefined
      );

      // Return a context with the previous values
      return { previousExpenses, previousExpense };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousExpenses) {
        queryClient.setQueryData(queryKeys.expenses, context.previousExpenses);
      }
      if (context?.previousExpense) {
        queryClient.setQueryData(queryKeys.expense(variables.id), context.previousExpense);
      }
      
      toast({
        title: "Erro ao atualizar despesa",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Despesa atualizada com sucesso",
        description: "As informações foram salvas.",
      });
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(variables.id) });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast({
        title: "Despesa excluída com sucesso",
        description: "A despesa foi removida do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir despesa",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
    },
  });
};