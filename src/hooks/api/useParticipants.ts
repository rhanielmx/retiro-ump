'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Participant,
  ParticipantFilters,
  CreateParticipantData,
  UpdateParticipantData,
  PaymentUpdateData,
  queryKeys,
  PaymentStatus,
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Helper functions for participant operations
const fetchParticipants = async (filters: ParticipantFilters = {}): Promise<Participant[]> => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.paymentType && filters.paymentType !== 'all') params.append('paymentType', filters.paymentType);
  if (filters.searchTerm) params.append('search', filters.searchTerm);

  const response = await fetch(`/api/admin/participants?${params}`);

  if (!response.ok) {
    let errorMessage = 'Erro ao buscar participantes';
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

const createParticipant = async (data: CreateParticipantData): Promise<Participant> => {
  const response = await fetch('/api/admin/participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao criar participante';
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

const updateParticipant = async (data: UpdateParticipantData): Promise<Participant> => {
  const response = await fetch('/api/admin/participants', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao atualizar participante';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // Se não for possível parsear JSON, usa mensagem padrão
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const deleteParticipant = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/participants?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao excluir participante';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }
};

const updatePayment = async (data: PaymentUpdateData): Promise<Participant> => {
  const response = await fetch('/api/admin/participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: data.id,
      paidAmount: data.paidAmount,
      paidAt: data.paidAt || new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Erro ao atualizar pagamento';
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

// Query hooks
export const useParticipants = (filters: ParticipantFilters = {}) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: [...queryKeys.participants, filters],
    queryFn: () => fetchParticipants(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useParticipant = (id: string) => {
  return useQuery({
    queryKey: queryKeys.participant(id),
    queryFn: async (): Promise<Participant> => {
      const response = await fetch(`/api/admin/participants?id=${id}`);
      
  if (!response.ok) {
    let errorMessage = 'Erro ao atualizar participante';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

      const participants = await response.json();
      return participants[0]; // API returns array, get first item
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks
export const useCreateParticipant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createParticipant,
    onMutate: async (newParticipant) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.participants });

      // Snapshot the previous value
      const previousParticipants = queryClient.getQueryData<Participant[]>(queryKeys.participants);

      // Optimistically update to the new value
      queryClient.setQueryData<Participant[]>(queryKeys.participants, (old) => 
        old ? [...old, { ...newParticipant, id: 'temp-id', registeredAt: new Date().toISOString(), status: PaymentStatus.PENDING }] : []
      );

      // Return a context with the previous value
      return { previousParticipants };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousParticipants) {
        queryClient.setQueryData(queryKeys.participants, context.previousParticipants);
      }
      
      toast({
        title: "Erro ao criar participante",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Participante criado com sucesso",
        description: "O participante foi adicionado ao sistema.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateParticipant,
    onMutate: async (updatedParticipant) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.participants });
      await queryClient.cancelQueries({ queryKey: queryKeys.participant(updatedParticipant.id) });

      // Snapshot the previous values
      const previousParticipants = queryClient.getQueryData<Participant[]>(queryKeys.participants);
      const previousParticipant = queryClient.getQueryData<Participant>(queryKeys.participant(updatedParticipant.id));

      // Optimistically update to the new value
      queryClient.setQueryData<Participant[]>(queryKeys.participants, (old) =>
        old?.map((participant) =>
          participant.id === updatedParticipant.id ? { ...participant, ...updatedParticipant } : participant
        ) || []
      );

      queryClient.setQueryData<Participant>(queryKeys.participant(updatedParticipant.id), (old) =>
        old ? { ...old, ...updatedParticipant } : undefined
      );

      // Return a context with the previous values
      return { previousParticipants, previousParticipant };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous values
      if (context?.previousParticipants) {
        queryClient.setQueryData(queryKeys.participants, context.previousParticipants);
      }
      if (context?.previousParticipant) {
        queryClient.setQueryData(queryKeys.participant(variables.id), context.previousParticipant);
      }
      
      toast({
        title: "Erro ao atualizar participante",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Participante atualizado com sucesso",
        description: "As informações foram salvas.",
      });
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.participants });
      queryClient.invalidateQueries({ queryKey: queryKeys.participant(variables.id) });
    },
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      toast({
        title: "Participante excluído com sucesso",
        description: "O participante foi removido do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir participante",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      toast({
        title: "Pagamento atualizado com sucesso",
        description: "As informações de pagamento foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar pagamento",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.participants });
    },
  });
};