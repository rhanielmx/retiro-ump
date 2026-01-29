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
import { Plus, Edit, Trash2, FileText, Calendar, DollarSign, Users } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phone-utils';
import {
  useParticipants,
  useCreateParticipant,
  useUpdateParticipant,
  useDeleteParticipant,
  useUpdatePayment,
} from '@/hooks/api';
import { ParticipantFilters, Participant, PaymentType } from '@/types/api';

const participantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  age: z.string().min(1, 'Idade é obrigatória'),
  church: z.string().optional(),
  emergencyContact: z.string().min(1, 'Contato de emergência é obrigatório'),
  emergencyPhone: z.string().min(10, 'Telefone de emergência é obrigatório'),
  foodRestrictions: z.string().optional(),
  medications: z.string().optional(),
  observations: z.string().optional(),
  paymentType: z.enum(['FULL', 'DAILY', 'PARTIAL']),
  fullPrice: z.string().optional(),
  dailyRate: z.string().optional(),
  daysStayed: z.string().optional(),
  discount: z.string().optional(),
  paidAmount: z.string().optional(),
  confirmed: z.boolean()
});

type ParticipantForm = z.infer<typeof participantSchema>;

const paymentTypeLabels = {
  [PaymentType.FULL]: 'Retiro Completo',
  [PaymentType.DAILY]: 'Diária',
  [PaymentType.PARTIAL]: 'Parcial'
};

const statusLabels = {
  PENDING: 'Pendente',
  PARTIAL: 'Parcial',
  PAID: 'Pago',
  OVERDUE: 'Atrasado'
};

export function ParticipantsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [filters, setFilters] = useState<ParticipantFilters>({
    status: 'all',
    paymentType: 'all',
    searchTerm: ''
  });

  // Use TanStack Query for data fetching
  const { data: participants = [], isLoading } = useParticipants(filters);
  const createParticipantMutation = useCreateParticipant();
  const updateParticipantMutation = useUpdateParticipant();
  const deleteParticipantMutation = useDeleteParticipant();
  const updatePaymentMutation = useUpdatePayment();

  const form = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: '',
      phone: '',
      age: '',
      church: '',
      emergencyContact: '',
      emergencyPhone: '',
      foodRestrictions: '',
      medications: '',
      observations: '',
      paymentType: 'FULL',
      fullPrice: '',
      dailyRate: '',
      daysStayed: '',
      discount: '',
      paidAmount: '',
      confirmed: false
    }
  });

  const onSubmit = async (data: ParticipantForm) => {
    try {
      const payload = {
        ...data,
        age: parseInt(data.age),
        daysStayed: data.daysStayed ? parseInt(data.daysStayed) : undefined,
        discount: data.discount || '0',
        paidAmount: data.paidAmount || '0',
        paymentType: data.paymentType as PaymentType
      };

      if (editingParticipant) {
        await updateParticipantMutation.mutateAsync({ ...payload, id: editingParticipant.id });
      } else {
        await createParticipantMutation.mutateAsync(payload);
      }

      setDialogOpen(false);
      setEditingParticipant(null);
      form.reset();
    } catch (error) {
      console.error('Error saving participant:', error);
    }
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    form.reset({
      name: participant.name,
      phone: participant.phone,
      age: participant.age.toString(),
      church: participant.church || '',
      emergencyContact: participant.emergencyContact,
      emergencyPhone: participant.emergencyPhone,
      foodRestrictions: participant.foodRestrictions || '',
      medications: participant.medications || '',
      observations: participant.observations || '',
      paymentType: participant.paymentType,
      fullPrice: participant.fullPrice || '',
      dailyRate: participant.dailyRate || '',
      daysStayed: participant.daysStayed?.toString() || '',
      discount: participant.discount,
      paidAmount: participant.paidAmount,
      confirmed: participant.confirmed
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
      try {
        await deleteParticipantMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
  };

  const handlePaymentUpdate = async (participantId: string, paidAmount: string) => {
    try {
      await updatePaymentMutation.mutateAsync({
        id: participantId,
        paidAmount,
        paidAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const calculateTotals = () => {
    const totals = {
      pending: 0,
      partial: 0,
      paid: 0,
      total: 0
    };

    participants.forEach(p => {
      const totalAmount = parseFloat(p.totalAmount || '0');
      const paidAmount = parseFloat(p.paidAmount || '0');
      
      // Total geral devido
      totals.total += totalAmount;
      
      // Total já pago (independente do status)
      totals.paid += paidAmount;
      
      // Total pendente (o que ainda falta pagar)
      const pendingAmount = totalAmount - paidAmount;
      if (pendingAmount > 0) {
        totals.pending += pendingAmount;
      }
      
      // Total parcial (já pago, mas ainda não completou o total)
      if (paidAmount > 0 && paidAmount < totalAmount) {
        totals.partial += paidAmount;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Participantes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingParticipant(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Participante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingParticipant ? 'Editar Participante' : 'Novo Participante'}</DialogTitle>
              <DialogDescription>Preencha as informações do participante</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
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
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Idade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="church"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Igreja (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Igreja" {...field} />
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
                        <FormLabel>Contato de Emergência</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do contato" {...field} />
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
                        <FormLabel>Telefone de Emergência</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FULL">Retiro Completo</SelectItem>
                            <SelectItem value="DAILY">Diária</SelectItem>
                            <SelectItem value="PARTIAL">Parcial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('paymentType') === 'FULL' && (
                    <FormField
                      control={form.control}
                      name="fullPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do Retiro (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch('paymentType') === 'DAILY' && (
                    <>
                      <FormField
                        control={form.control}
                        name="dailyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor da Diária (R$)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="50.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="daysStayed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dias de Estadia</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paidAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Já Pago (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="confirmed"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Confirmado
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foodRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restrições Alimentares (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Alergias, intolerâncias, etc." {...field} />
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
                      <FormLabel>Medicações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Medicamentos controlados, etc." {...field} />
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
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Outras observações importantes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingParticipant ? 'Atualizar' : 'Salvar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="PARTIAL">Parciais</SelectItem>
                <SelectItem value="PAID">Pagos</SelectItem>
                <SelectItem value="OVERDUE">Atrasados</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.paymentType} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="FULL">Retiro Completo</SelectItem>
                <SelectItem value="DAILY">Diária</SelectItem>
                <SelectItem value="PARTIAL">Parcial</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              placeholder="Buscar por nome, telefone ou igreja"
            />

            <Button
              variant="outline"
              onClick={() => setFilters({ status: 'all', paymentType: 'all', searchTerm: '' })}
            >
              Limpar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Geral</p>
                <p className="text-2xl font-bold">R$ {totals.total.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">R$ {totals.pending.toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Parciais</p>
                <p className="text-2xl font-bold text-blue-600">R$ {totals.partial.toFixed(2)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos</p>
                <p className="text-2xl font-bold text-green-600">R$ {totals.paid.toFixed(2)}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Participantes ({participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{participant.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatPhoneNumber(participant.phone)} • {participant.age} anos
                    {participant.church && ` • ${participant.church}`}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {paymentTypeLabels[participant.paymentType]} • 
                    {statusLabels[participant.status]} • 
                    {participant.confirmed ? 'Confirmado' : 'Pendente'}
                  </div>
                  {participant.totalAmount && (
                    <div className="text-sm font-medium mt-1">
                      Total: R$ {parseFloat(participant.totalAmount).toFixed(2)} • 
                      Pago: R$ {parseFloat(participant.paidAmount).toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(participant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(participant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {participants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum participante encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}