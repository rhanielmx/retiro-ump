'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Plus, Upload, Trophy, Users } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  allowMultipleWinners: boolean;
}

interface Participant {
  id: string;
  name: string;
  nickname: string | null;
  isActive: boolean;
}

interface RankingItem {
  rank: number;
  participantIds: string[];
  names: string[];
  votes: number;
}

interface CategoryResult {
  categoryId: string;
  categoryName: string;
  allowMultipleWinners: boolean;
  totalVotes: number;
  ranking: RankingItem[];
}

export default function AdminVotacaoPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categorias');
  
  // Category form
  const [categoryName, setCategoryName] = useState('');
  const [categoryOrder, setCategoryOrder] = useState(0);
  const [categoryAllowMultiple, setCategoryAllowMultiple] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Participant form
  const [participantName, setParticipantName] = useState('');
  const [participantNickname, setParticipantNickname] = useState('');
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  
  // Import
  const [importText, setImportText] = useState('');
  const [importCategoriesText, setImportCategoriesText] = useState('');
  
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (hasInitialized) return;
      
      setCheckingAuth(true);
      const isValid = await checkAuth();
      if (!isValid) {
        router.push('/login');
      }
      setCheckingAuth(false);
      setHasInitialized(true);
    };

    initializeAuth();
  }, [checkAuth, hasInitialized, router]);

  useEffect(() => {
    if (!checkingAuth && isAuthenticated) {
      loadData();
    }
  }, [checkingAuth, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, partRes, resRes] = await Promise.all([
        fetch('/api/admin/votacao/categorias'),
        fetch('/api/admin/votacao/participantes'),
        fetch('/api/admin/votacao/resultados'),
      ]);
      
      const cats = await catRes.json();
      const parts = await partRes.json();
      const res = await resRes.json();
      
      setCategories(cats);
      setParticipants(parts);
      setResults(res);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await fetch('/api/admin/votacao/categorias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name: categoryName,
            order: categoryOrder,
            allowMultipleWinners: categoryAllowMultiple,
          }),
        });
      } else {
        await fetch('/api/admin/votacao/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: categoryName, 
            order: categoryOrder,
            allowMultipleWinners: categoryAllowMultiple,
          }),
        });
      }
      
      setCategoryName('');
      setCategoryOrder(0);
      setCategoryAllowMultiple(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    
    try {
      await fetch(`/api/admin/votacao/categorias?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleToggleCategory = async (category: Category) => {
    try {
      await fetch('/api/admin/votacao/categorias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          order: category.order,
          isActive: !category.isActive,
        }),
      });
      loadData();
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  };

  const handleSaveParticipant = async () => {
    try {
      if (editingParticipant) {
        await fetch('/api/admin/votacao/participantes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingParticipant.id,
            name: participantName,
            nickname: participantNickname || null,
          }),
        });
      } else {
        await fetch('/api/admin/votacao/participantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: participantName,
            nickname: participantNickname || null,
          }),
        });
      }
      
      setParticipantName('');
      setParticipantNickname('');
      setEditingParticipant(null);
      loadData();
    } catch (error) {
      console.error('Error saving participant:', error);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este participante?')) return;
    
    try {
      await fetch(`/api/admin/votacao/participantes?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };

  const handleImportParticipants = async () => {
    const lines = importText.split('\n').map(n => n.trim()).filter(n => n);
    if (lines.length === 0) return;
    
    const participants = lines.map(line => {
      const parts = line.split('|').map(s => s.trim());
      return {
        name: parts[0],
        nickname: parts[1] || undefined,
      };
    });
    
    try {
      await fetch('/api/admin/votacao/participantes/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants }),
      });
      
      setImportText('');
      loadData();
    } catch (error) {
      console.error('Error importing participants:', error);
    }
  };

  const handleImportCategories = async () => {
    const names = importCategoriesText.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length === 0) return;
    
    try {
      await fetch('/api/admin/votacao/categorias/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names }),
      });
      
      setImportCategoriesText('');
      loadData();
    } catch (error) {
      console.error('Error importing categories:', error);
    }
  };

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Administração de Votação</h1>
            <p className="text-muted-foreground">Gerencie categorias, participantes e visualize resultados</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Voltar ao Painel
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="categorias">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Categorias de Votação</CardTitle>
                      <CardDescription>Gerencie as categorias disponíveis para votação</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingCategory(null); setCategoryName(''); setCategoryOrder(0); setCategoryAllowMultiple(false); }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Categoria
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Nome</label>
                            <Input
                              value={categoryName}
                              onChange={(e) => setCategoryName(e.target.value)}
                              placeholder="Ex: Melhor pregador"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ordem</label>
                            <Input
                              type="number"
                              value={categoryOrder}
                              onChange={(e) => setCategoryOrder(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="allowMultiple"
                              checked={categoryAllowMultiple}
                              onChange={(e) => setCategoryAllowMultiple(e.target.checked)}
                              className="w-4 h-4"
                            />
                            <label htmlFor="allowMultiple" className="text-sm">
                              Permitir múltiplos vencedores (para duplas/trios)
                            </label>
                          </div>
                          <Button onClick={handleSaveCategory} className="w-full">
                            {editingCategory ? 'Salvar' : 'Criar'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ordem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Múltiplos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.order}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            {category.allowMultipleWinners ? 'Sim' : 'Não'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={category.isActive ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleToggleCategory(category)}
                            >
                              {category.isActive ? 'Ativa' : 'Inativa'}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingCategory(category);
                                      setCategoryName(category.name);
                                      setCategoryOrder(category.order);
                                      setCategoryAllowMultiple(category.allowMultipleWinners);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                  <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Categoria</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Nome</label>
                                      <Input
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Ordem</label>
                                      <Input
                                        type="number"
                                        value={categoryOrder}
                                        onChange={(e) => setCategoryOrder(parseInt(e.target.value) || 0)}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        id="allowMultipleEdit"
                                        checked={categoryAllowMultiple}
                                        onChange={(e) => setCategoryAllowMultiple(e.target.checked)}
                                        className="w-4 h-4"
                                      />
                                      <label htmlFor="allowMultipleEdit" className="text-sm">
                                        Permitir múltiplos vencedores (para duplas/trios)
                                      </label>
                                    </div>
                                    <Button onClick={handleSaveCategory} className="w-full">
                                      Salvar
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Importar Categorias</CardTitle>
                  <CardDescription>
                    Cole uma lista de categorias (uma por linha) para importar em lote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={importCategoriesText}
                    onChange={(e) => setImportCategoriesText(e.target.value)}
                    placeholder="Melhor pregador&#10;Melhor louvor&#10;Melhor atividade&#10;Melhor momento"
                    className="w-full h-64 p-3 border rounded-md resize-none"
                  />
                  <Button onClick={handleImportCategories} className="w-full" disabled={!importCategoriesText.trim()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Lista
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participantes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Participantes</CardTitle>
                      <CardDescription>Gerencie os participantes disponíveis para votação</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => { setEditingParticipant(null); setParticipantName(''); setParticipantNickname(''); }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingParticipant ? 'Editar Participante' : 'Novo Participante'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Nome</label>
                            <Input
                              value={participantName}
                              onChange={(e) => setParticipantName(e.target.value)}
                              placeholder="Ex: José Alberto"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Apelido (opcional)</label>
                            <Input
                              value={participantNickname}
                              onChange={(e) => setParticipantNickname(e.target.value)}
                              placeholder="Ex: Berg"
                            />
                          </div>
                          <Button onClick={handleSaveParticipant} className="w-full">
                            {editingParticipant ? 'Salvar' : 'Criar'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Apelido</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.slice(0, 50).map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.nickname || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingParticipant(participant);
                                        setParticipantName(participant.name);
                                        setParticipantNickname(participant.nickname || '');
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Participante</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Nome</label>
                                        <Input
                                          value={participantName}
                                          onChange={(e) => setParticipantName(e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Apelido (opcional)</label>
                                        <Input
                                          value={participantNickname}
                                          onChange={(e) => setParticipantNickname(e.target.value)}
                                          placeholder="Ex: Berg"
                                        />
                                      </div>
                                      <Button onClick={handleSaveParticipant} className="w-full">
                                        Salvar
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteParticipant(participant.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {participants.length > 50 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Mostrando 50 de {participants.length} participantes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Importar Participantes</CardTitle>
                  <CardDescription>
                    Cole uma lista de nomes (um por linha). Use | para separar apelido. Ex: João Neto|Berg
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="José Alberto&#10;João Neto|Berg&#10;Maria Silva"
                    className="w-full h-64 p-3 border rounded-md resize-none"
                  />
                  <Button onClick={handleImportParticipants} className="w-full" disabled={!importText.trim()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Lista
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resultados">
            <div className="space-y-6">
              {results.map((result) => (
                <Card key={result.categoryId}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      {result.categoryName}
                    </CardTitle>
                    <CardDescription>
                      Total de votos: {result.totalVotes}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.ranking.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Posição</TableHead>
                            <TableHead>{result.allowMultipleWinners ? 'Grupo' : 'Nome'}</TableHead>
                            <TableHead className="text-right">Votos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.ranking.map((item) => (
                            <TableRow key={item.participantIds.join(',')}>
                              <TableCell>
                                {item.rank <= 3 ? (
                                  <span className={`font-bold ${
                                    item.rank === 1 ? 'text-yellow-500' :
                                    item.rank === 2 ? 'text-gray-400' :
                                    'text-amber-700'
                                  }`}>
                                    #{item.rank}
                                  </span>
                                ) : (
                                  <span>#{item.rank}</span>
                                )}
                              </TableCell>
                              <TableCell>{item.names.join(' + ')}</TableCell>
                              <TableCell className="text-right font-medium">{item.votes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhum voto registrado ainda
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
