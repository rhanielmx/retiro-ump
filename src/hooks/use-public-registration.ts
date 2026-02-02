'use client';

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationData {
  name: string;
  phone: string;
  age: number;
  church?: string;
  emergencyContact: string;
  emergencyPhone: string;
  foodRestrictions?: string;
  medications?: string;
  observations?: string;
  paymentType?: string;
  confirmed?: boolean;
  discount?: string;
  paidAmount?: string;
}

interface RegistrationResponse {
  message: string;
  participant?: unknown;
}

const registerParticipant = async (data: RegistrationData): Promise<RegistrationResponse> => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao realizar inscrição');
  }

  return response.json();
};

export const usePublicRegistration = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: registerParticipant,
    onSuccess: (data) => {
      toast({
        title: "Inscrição realizada com sucesso!",
        description: data.message || "Sua inscrição foi confirmada.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};