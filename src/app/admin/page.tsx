'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Participant {
  id: string;
  name: string;
  phone: string;
  age: number;
  church: string | null;
  emergencyContact: string;
  emergencyPhone: string;
  foodRestrictions: string | null;
  medications: string | null;
  observations: string | null;
  registeredAt: string;
  confirmed: boolean;
  paymentType: 'FULL' | 'DAILY' | 'PARTIAL';
  fullPrice: string | null;
  dailyRate: string | null;
  daysStayed: number | null;
  discount: string;
  totalAmount: string | null;
  paidAmount: string;
  paidAt: string | null;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const router = useRouter();

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/participants', {
        headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password)
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }

      const data = await response.json();
      setParticipants(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar participantes');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      if (response.ok) {
        setAuthenticated(true);
        fetchParticipants();
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao tentar fazer login');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setParticipants([]);
  };

  const filteredParticipants = participants.filter(participant => {
    // Filter by status
    if (filterStatus === 'paid' && participant.status !== 'PAID') return false;
    if (filterStatus === 'notPaid' && participant.status === 'PAID') return false;
    if (filterStatus === 'confirmed' && !participant.confirmed) return false;
    if (filterStatus === 'partial' && participant.status !== 'PARTIAL') return false;
    if (filterStatus === 'pending' && participant.status !== 'PENDING') return false;

    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.phone.includes(searchLower) ||
      (participant.church && participant.church.toLowerCase().includes(searchLower))
    );
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Área Administrativa</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status de Pagamento
                </label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="paid">Pagos</option>
                  <option value="notPaid">Não Pagos</option>
                  <option value="partial">Parcialmente Pagos</option>
                  <option value="pending">Pendentes</option>
                  <option value="confirmed">Confirmados</option>
                </select>
              </div>

              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, telefone, igreja..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Pendentes
                </label>
                <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  {participants.filter(p => p.status === 'PENDING').length}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Parciais
                </label>
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                  {participants.filter(p => p.status === 'PARTIAL').length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Participantes ({filteredParticipants.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">Carregando...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">Nenhum participante encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParticipants.map((participant) => (
                      <tr key={participant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                          <div className="text-sm text-gray-500">{participant.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            participant.paymentType === 'FULL' ? 'bg-green-100 text-green-800' :
                            participant.paymentType === 'DAILY' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {participant.paymentType === 'FULL' ? 'Completo' :
                             participant.paymentType === 'DAILY' ? 'Diária' : 'Parcial'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {participant.totalAmount ? `R$ ${parseFloat(participant.totalAmount).toFixed(2)}` : 'N/A'}
                          </div>
                          {participant.discount && parseFloat(participant.discount) > 0 && (
                            <div className="text-xs text-red-600">
                              Desconto: R$ {parseFloat(participant.discount).toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            R$ {parseFloat(participant.paidAmount).toFixed(2)}
                          </div>
                          {participant.totalAmount && (
                            <div className="text-xs text-gray-500">
                              {((parseFloat(participant.paidAmount) / parseFloat(participant.totalAmount)) * 100).toFixed(0)}%
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            participant.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            participant.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' :
                            participant.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {participant.status === 'PAID' ? 'Pago' :
                             participant.status === 'PARTIAL' ? 'Parcial' :
                             participant.status === 'OVERDUE' ? 'Atrasado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setEditingParticipant(participant);
                                setEditingField('payment');
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar Pagamento
                            </button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-green-600 hover:text-green-900">
                                  Ver Detalhes
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Participante</DialogTitle>
                                  <DialogDescription>
                                    Informações completas sobre {participant.name}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Nome</p>
                                    <p className="font-medium">{participant.name}</p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Telefone</p>
                                    <p className="font-medium">{participant.phone}</p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Idade</p>
                                    <p className="font-medium">{participant.age}</p>
                                  </div>

                                  {participant.church && (
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Igreja</p>
                                      <p className="font-medium">{participant.church}</p>
                                    </div>
                                  )}

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Tipo de Pagamento</p>
                                    <p className="font-medium">
                                      {participant.paymentType === 'FULL' ? 'Retiro Completo' :
                                       participant.paymentType === 'DAILY' ? 'Diária' : 'Parcial'}
                                    </p>
                                  </div>

                                  {participant.paymentType === 'DAILY' && participant.dailyRate && (
                                    <>
                                      <div>
                                        <p className="text-sm text-gray-600 mb-1">Valor da Diária</p>
                                        <p className="font-medium">R$ {parseFloat(participant.dailyRate).toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600 mb-1">Dias de Estadia</p>
                                        <p className="font-medium">{participant.daysStayed || 0}</p>
                                      </div>
                                    </>
                                  )}

                                  {participant.fullPrice && (
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                                      <p className="font-medium">R$ {parseFloat(participant.fullPrice).toFixed(2)}</p>
                                    </div>
                                  )}

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Desconto</p>
                                    <p className="font-medium text-red-600">
                                      R$ {parseFloat(participant.discount).toFixed(2)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Valor Final</p>
                                    <p className="font-medium">
                                      R$ {participant.totalAmount ? parseFloat(participant.totalAmount).toFixed(2) : '0.00'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Já Pago</p>
                                    <p className="font-medium">R$ {parseFloat(participant.paidAmount).toFixed(2)}</p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <p className="font-medium">
                                      {participant.status === 'PAID' ? 'Pago' :
                                       participant.status === 'PARTIAL' ? 'Parcial' :
                                       participant.status === 'OVERDUE' ? 'Atrasado' : 'Pendente'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Contato de Emergência</p>
                                    <p className="font-medium">{participant.emergencyContact} ({participant.emergencyPhone})</p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Confirmação</p>
                                    <p className="font-medium">{participant.confirmed ? 'Confirmado' : 'Pendente'}</p>
                                  </div>
                                </div>

                                {participant.foodRestrictions && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Restrições Alimentares</p>
                                    <p className="font-medium text-red-600">{participant.foodRestrictions}</p>
                                  </div>
                                )}

                                {participant.medications && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Medicações</p>
                                    <p className="font-medium">{participant.medications}</p>
                                  </div>
                                )}

                                {participant.observations && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Observações</p>
                                    <p className="font-medium">{participant.observations}</p>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Edição de Pagamento */}
      {editingParticipant && editingField === 'payment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Editar Pagamento - {editingParticipant.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Pagamento
                  </label>
                  <select
                    value={editingParticipant.paymentType}
                    onChange={(e) => setEditingParticipant({
                      ...editingParticipant,
                      paymentType: e.target.value as any,
                      // Reset values based on type
                      fullPrice: e.target.value === 'FULL' ? editingParticipant.fullPrice : null,
                      dailyRate: e.target.value === 'DAILY' ? (editingParticipant.dailyRate || '50.00') : null,
                      daysStayed: e.target.value === 'DAILY' ? (editingParticipant.daysStayed || 1) : null,
                      totalAmount: null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="FULL">Retiro Completo</option>
                    <option value="DAILY">Diária</option>
                    <option value="PARTIAL">Parcial</option>
                  </select>
                </div>

                {editingParticipant.paymentType === 'FULL' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor do Retiro Completo (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingParticipant.fullPrice || ''}
                      onChange={(e) => {
                        const fullPrice = e.target.value ? parseFloat(e.target.value) : null;
                        const totalAmount = fullPrice ? fullPrice - parseFloat(editingParticipant.discount) : null;
                        setEditingParticipant({
                          ...editingParticipant,
                          fullPrice: e.target.value,
                          totalAmount: totalAmount?.toString() || null
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}

                {editingParticipant.paymentType === 'DAILY' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor da Diária (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingParticipant.dailyRate || '50.00'}
                        onChange={(e) => {
                          const dailyRate = parseFloat(e.target.value);
                          const daysStayed = editingParticipant.daysStayed || 1;
                          const totalAmount = dailyRate * daysStayed - parseFloat(editingParticipant.discount);
                          setEditingParticipant({
                            ...editingParticipant,
                            dailyRate: e.target.value,
                            totalAmount: totalAmount.toString()
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dias de Estadia
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingParticipant.daysStayed || 1}
                        onChange={(e) => {
                          const daysStayed = parseInt(e.target.value);
                          const dailyRate = parseFloat(editingParticipant.dailyRate || '50.00');
                          const totalAmount = dailyRate * daysStayed - parseFloat(editingParticipant.discount);
                          setEditingParticipant({
                            ...editingParticipant,
                            daysStayed,
                            totalAmount: totalAmount.toString()
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingParticipant.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value || '0');
                      let totalAmount;
                      
                      if (editingParticipant.paymentType === 'FULL' && editingParticipant.fullPrice) {
                        totalAmount = parseFloat(editingParticipant.fullPrice) - discount;
                      } else if (editingParticipant.paymentType === 'DAILY' && editingParticipant.dailyRate && editingParticipant.daysStayed) {
                        totalAmount = (parseFloat(editingParticipant.dailyRate) * editingParticipant.daysStayed) - discount;
                      } else {
                        totalAmount = 0;
                      }
                      
                      setEditingParticipant({
                        ...editingParticipant,
                        discount: e.target.value,
                        totalAmount: totalAmount.toString()
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Final (R$)
                  </label>
                  <input
                    type="text"
                    value={editingParticipant.totalAmount ? parseFloat(editingParticipant.totalAmount).toFixed(2) : '0.00'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Já Pago (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingParticipant.paidAmount}
                    onChange={(e) => {
                      const paidAmount = parseFloat(e.target.value || '0');
                      const totalAmount = editingParticipant.totalAmount ? parseFloat(editingParticipant.totalAmount) : 0;
                      let status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' = 'PENDING';
                      
                      if (paidAmount >= totalAmount && totalAmount > 0) {
                        status = 'PAID';
                      } else if (paidAmount > 0 && paidAmount < totalAmount) {
                        status = 'PARTIAL';
                      }
                      
                      setEditingParticipant({
                        ...editingParticipant,
                        paidAmount: e.target.value,
                        status
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/participants', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + btoa(username + ':' + password)
                          },
                          body: JSON.stringify(editingParticipant)
                        });

                        if (response.ok) {
                          setEditingParticipant(null);
                          setEditingField(null);
                          fetchParticipants();
                        } else {
                          alert('Erro ao atualizar pagamento');
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('Erro ao atualizar pagamento');
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingParticipant(null);
                      setEditingField(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
