'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, CheckCircle } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  age: z.number().min(13, 'Idade mínima é 13 anos').max(100, 'Idade máxima é 100 anos'),
  church: z.string().optional(),
  emergencyContact: z.string().min(2, 'Nome do contato deve ter pelo menos 2 caracteres'),
  emergencyPhone: z.string().min(10, 'Telefone do contato deve ter pelo menos 10 dígitos'),
  foodRestrictions: z.string().optional(),
  medications: z.string().optional(),
  observations: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      phone: '',
      age: undefined,
      church: '',
      emergencyContact: '',
      emergencyPhone: '',
      foodRestrictions: '',
      medications: '',
      observations: '',
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Erro ao enviar inscrição');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Inscreva-se no Retiro</CardTitle>
        <CardDescription className="text-center">
          Preencha o formulário abaixo para se inscrever no Retiro de Jovens UMP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" className="placeholder:text-muted-foreground/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" className="placeholder:text-muted-foreground/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="18"
                        className="placeholder:text-muted-foreground/50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="church"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Igreja (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Caso seja de outra igreja ou comunidade" className="placeholder:text-muted-foreground/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato de Emergência *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" className="placeholder:text-muted-foreground/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de Emergência *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" className="placeholder:text-muted-foreground/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="foodRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restrições Alimentares</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alergias, intolerâncias, vegetariano, etc."
                      className="resize-none placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Está tomando alguma medicação no momento?"
                      className="resize-none placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais que gostaria de compartilhar"
                      className="resize-none placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span>Inscrição realizada com sucesso! Entraremos em contato em breve.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
