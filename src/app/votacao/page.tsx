'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Trophy, AlertCircle, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  order: number;
  allowMultipleWinners: boolean;
}

interface Participant {
  id: string;
  name: string;
  nickname: string | null;
}

const CATEGORIES_PER_STEP = 6;

function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('votacao_device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('votacao_device_id', deviceId);
  }
  return deviceId;
}

function saveVotacaoState(step: number, votes: Record<string, string[]>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('votacao_current_step', step.toString());
  localStorage.setItem('votacao_votes', JSON.stringify(votes));
}

function loadVotacaoState(): { step: number; votes: Record<string, string[]> } {
  if (typeof window === 'undefined') return { step: 0, votes: {} };
  
  const step = parseInt(localStorage.getItem('votacao_current_step') || '0', 10);
  const votes = JSON.parse(localStorage.getItem('votacao_votes') || '{}');
  return { step, votes };
}

function findCurrentStep(categories: Category[], serverVotes: Record<string, string[]>): number {
  const totalSteps = Math.ceil(categories.length / CATEGORIES_PER_STEP);
  
  for (let step = 0; step < totalSteps; step++) {
    const startIdx = step * CATEGORIES_PER_STEP;
    const endIdx = Math.min(startIdx + CATEGORIES_PER_STEP, categories.length);
    const stepCategories = categories.slice(startIdx, endIdx);
    
    const allVoted = stepCategories.every(cat => 
      serverVotes[cat.id] && serverVotes[cat.id].length > 0
    );
    
    if (!allVoted) {
      return step;
    }
  }
  
  return totalSteps;
}

export default function VotacaoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, string[]>>({});
  const [serverVotes, setServerVotes] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId] = useState(getDeviceId);

  const totalSteps = Math.ceil(categories.length / CATEGORIES_PER_STEP);
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentCategories = categories.slice(
    currentStep * CATEGORIES_PER_STEP,
    (currentStep + 1) * CATEGORIES_PER_STEP
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, votesRes] = await Promise.all([
          fetch('/api/votacao/categorias'),
          fetch(`/api/votacao/meus-votos?deviceId=${deviceId}`),
        ]);

        const categoriesData = await categoriesRes.json();
        const serverVotesData = await votesRes.json();
        
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(categoriesArray);
        
        const votesMap = votesRes.ok && typeof serverVotesData === 'object' 
          ? serverVotesData 
          : {};
        setServerVotes(votesMap);
        
        const localState = loadVotacaoState();
        const mergedVotes = { ...localState.votes, ...votesMap };
        setVotes(mergedVotes);
        
        const calculatedStep = findCurrentStep(categoriesArray, votesMap);
        
        if (calculatedStep >= Math.ceil(categoriesArray.length / CATEGORIES_PER_STEP)) {
          setCompleted(true);
        } else {
          setCurrentStep(calculatedStep);
          if (calculatedStep !== localState.step) {
            saveVotacaoState(calculatedStep, mergedVotes);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) {
      loadData();
    }
  }, [deviceId]);

  const handleVote = (categoryId: string, participantIds: string[]) => {
    setVotes((prev) => ({ ...prev, [categoryId]: participantIds }));
    setError(null);
  };

  const handleSubmitStep = async () => {
    const stepCategories = currentCategories;
    
    const missingVotes = stepCategories.filter((cat) => {
      const categoryVotes = votes[cat.id];
      return !categoryVotes || categoryVotes.length === 0;
    });
    
    if (missingVotes.length > 0) {
      setError(`Por favor, vote em todas as categorias desta etapa antes de continuar.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      for (const cat of stepCategories) {
        const categoryVotes = votes[cat.id] || [];
        if (categoryVotes.length === 0) continue;

        const res = await fetch('/api/votacao/votar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: cat.id,
            participantIds: categoryVotes,
            deviceId,
          }),
        });

        const data = await res.json();

        if (res.status === 409) {
          setError(`Você já votou em "${cat.name}". Continuando com as próximas...`);
        } else if (res.status >= 400) {
          setError(`Erro ao votar em "${cat.name}": ${data.error}`);
          setSubmitting(false);
          return;
        } else {
          setServerVotes((prev) => ({
            ...prev,
            [cat.id]: categoryVotes,
          }));
        }
      }

      const newStep = currentStep + 1;
      const updatedVotes = { ...votes };
      stepCategories.forEach((cat) => {
        updatedVotes[cat.id] = votes[cat.id] || [];
      });
      
      saveVotacaoState(newStep, updatedVotes);

      if (newStep < totalSteps) {
        setCurrentStep(newStep);
      } else {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Error submitting votes:', err);
      setError('Ocorreu um erro ao enviar os votos. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Obrigado por votar!</CardTitle>
            <CardDescription>
              Seu voto foi registrado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Você pode compartilhar com outros participantes para que todos votem também!
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              Voltar para página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Votação ainda não aberta</CardTitle>
            <CardDescription>
              As categorias de votação serão disponibilizadas em breve.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalVotes = Object.values(votes).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Votação do Retiro</h1>
          <p className="text-muted-foreground mb-4">
            Vote em cada categoria selecionando o participante que você acha que merece
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Etapa {currentStep + 1} de {totalSteps}</span>
            <span>{totalVotes} / {categories.length} votos</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Etapa {currentStep + 1}</CardTitle>
            <CardDescription>
              Selecione o participante para cada categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategories.map((category) => (
              <VoteCategoryInput
                key={category.id}
                category={category}
                selectedParticipantIds={votes[category.id] || []}
                serverParticipantIds={serverVotes[category.id] || []}
                onSelect={(ids) => handleVote(category.id, ids)}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0 || submitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleSubmitStep}
            disabled={submitting}
          >
            {submitting ? (
              <span>Enviando...</span>
            ) : currentStep < totalSteps - 1 ? (
              <>
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Finalizar Votação
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function VoteCategoryInput({
  category,
  selectedParticipantIds,
  serverParticipantIds,
  onSelect,
}: {
  category: Category;
  selectedParticipantIds: string[];
  serverParticipantIds: string[];
  onSelect: (ids: string[]) => void;
}) {
  const hasServerVote = serverParticipantIds.length > 0;
  const [search, setSearch] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNames, setSelectedNames] = useState<Record<string, string>>({});
  const [inputDisabled, setInputDisabled] = useState(hasServerVote);

  useEffect(() => {
    if (hasServerVote && serverParticipantIds.length > 0) {
      const loadParticipantNames = async () => {
        const names: Record<string, string> = {};
        for (const id of serverParticipantIds) {
          try {
            const res = await fetch(`/api/votacao/participantes?id=${id}`);
            const data = await res.json();
            if (data && data.name) {
              names[id] = data.name;
            }
          } catch (error) {
            console.error('Error loading participant:', error);
          }
        }
        setSelectedNames(names);
      };
      loadParticipantNames();
    }
  }, [hasServerVote, serverParticipantIds]);

  const searchParticipants = useCallback(async (query: string) => {
    if (query.length < 1) {
      setParticipants([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/votacao/participantes?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchParticipants(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, searchParticipants]);

  const handleAddParticipant = (participant: Participant) => {
    if (category.allowMultipleWinners) {
      if (!selectedParticipantIds.includes(participant.id)) {
        onSelect([...selectedParticipantIds, participant.id]);
        setSelectedNames((prev) => ({ ...prev, [participant.id]: participant.name }));
      }
    } else {
      onSelect([participant.id]);
      setSelectedNames({ [participant.id]: participant.name });
      setInputDisabled(true);
    }
    setSearch('');
    setShowDropdown(false);
  };

  const handleRemoveParticipant = (participantId: string) => {
    const newIds = selectedParticipantIds.filter((id) => id !== participantId);
    onSelect(newIds);
    const newNames = { ...selectedNames };
    delete newNames[participantId];
    setSelectedNames(newNames);
    setInputDisabled(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!category.allowMultipleWinners && selectedParticipantIds.length > 0) {
      setSelectedNames({});
      onSelect([]);
      setInputDisabled(false);
    }
    setShowDropdown(true);
  };

  const isValidSelection = search && participants.some(
    (p) => p.name.toLowerCase() === search.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {category.name}
        {category.allowMultipleWinners && <span className="text-muted-foreground ml-2">(múltiplos)</span>}
        {hasServerVote && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Já votou</span>}
      </label>
      
      {selectedParticipantIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedParticipantIds.map((id) => (
            <span
              key={id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                hasServerVote ? 'bg-green-100 text-green-700' : 'bg-primary text-primary-foreground'
              }`}
            >
              {selectedNames[id] || 'Carregando...'}
              {!hasServerVote && (
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(id)}
                  className="hover:bg-white/20 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      
      {!hasServerVote && (
        <div className="relative">
          <Input
            value={search}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            disabled={inputDisabled}
            placeholder={category.allowMultipleWinners ? "Digite para buscar e adicionar..." : inputDisabled ? "Selecione um nome" : "Digite para buscar..."}
            className={`w-full ${search && !isValidSelection && !category.allowMultipleWinners ? 'border-red-500' : ''}`}
          />
          {showDropdown && (participants.length > 0 || loading) && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">Buscando...</div>
            ) : (
              participants
                .filter((p) => !selectedParticipantIds.includes(p.id))
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddParticipant(p)}
                    className="w-full text-left px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none"
                  >
                    {p.name}
                  </button>
                ))
            )}
          </div>
        )}
        </div>
      )}
      {search && !isValidSelection && !category.allowMultipleWinners && !hasServerVote && (
        <p className="text-xs text-red-500">Selecione um nome da lista</p>
      )}
    </div>
  );
}
