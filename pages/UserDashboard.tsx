import React, { useState, useEffect, useRef } from 'react';
import { User, MatchProfile, InterestType } from '../types';
import { Button } from '../components/Button';
import { SUBSCRIPTION_PLANS, MOCK_AVATARS, COUNTRIES } from '../constants';
import { analyzeCompatibility, generateDeepMatchAnalysis } from '../services/geminiService';
import { Star, Clock, MessageCircle, Shield, Zap, Info, Check, User as UserIcon, Save, ArrowLeft } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onUpgrade: () => void;
  onStartChat: (match: MatchProfile) => void;
  onUpdateUser?: (user: User) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpgrade, onStartChat, onUpdateUser }) => {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [view, setView] = useState<'MATCHES' | 'PROFILE'>('MATCHES');
  
  // Profile Edit State
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age?.toString() || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editInterest, setEditInterest] = useState<InterestType>(user.primaryInterest || InterestType.DATING);

  // Logic for Waiting List Number
  const [queuePosition] = useState(() => {
    const min = 45;
    const max = 980; 
    return Math.floor(Math.random() * (max - min + 1) + min);
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reload matches if interest changes and user is premium, or initially
    if (user.isPremium && view === 'MATCHES') {
      loadMatches();
    }
  }, [user.isPremium, user.primaryInterest, view]);

  const loadMatches = async () => {
    setLoadingMatches(true);
    // Simulate AI finding matches
    const fakeMatches: MatchProfile[] = await Promise.all([1, 2, 3].map(async (i) => {
      const score = await analyzeCompatibility(user.questionnaireAnswers || {}, user.primaryInterest || InterestType.DATING);
      const matchName = `Match ${i}`;
      
      return {
        id: `match-${i}`,
        name: matchName,
        age: 20 + Math.floor(Math.random() * 15),
        bio: "Alguém que partilha os teus interesses profundos em filosofia e vida.",
        compatibilityScore: score,
        interestType: user.primaryInterest || InterestType.DATING,
        avatarUrl: MOCK_AVATARS[i],
        isNew: true,
        matchReasoning: generateDeepMatchAnalysis(user.primaryInterest || InterestType.DATING, matchName), // Inject Deep AI Reason
        instagram: `@usuario_anonimo_${i}`,
        phoneNumber: `+351 9${Math.floor(Math.random() * 100000000)}`
      };
    }));

    if (isMounted.current) {
      setMatches(fakeMatches);
      setLoadingMatches(false);
    }
  };

  const handleSaveProfile = () => {
      if (onUpdateUser) {
          onUpdateUser({
              ...user,
              name: editName,
              age: parseInt(editAge),
              bio: editBio,
              primaryInterest: editInterest
          });
          alert("Perfil atualizado com sucesso!");
          setView('MATCHES');
      }
  };

  // --- RENDER PROFILE VIEW ---
  if (view === 'PROFILE') {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setView('MATCHES')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600"/>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">O Meu Perfil</h1>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                            <input 
                                type="number" 
                                value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interesse Principal</label>
                            <select 
                                value={editInterest}
                                onChange={(e) => setEditInterest(e.target.value as InterestType)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-purple-500 outline-none bg-white"
                            >
                                {Object.values(InterestType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Sobre Mim)</label>
                        <textarea 
                            rows={4}
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Escreve algo sobre ti para que os matches te conheçam melhor..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2"><Info className="w-4 h-4"/> Nota sobre a IA</h4>
                        <p className="text-xs text-blue-700">
                            Ao mudar o "Interesse Principal", a nossa IA irá recalcular os teus matches. Isto pode demorar alguns minutos.
                        </p>
                    </div>

                    <Button onClick={handleSaveProfile} fullWidth className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Guardar Alterações
                    </Button>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER WAITING LIST (FREE) ---
  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
        <button 
            onClick={() => setView('PROFILE')}
            className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
        >
            <UserIcon className="w-4 h-4" /> Perfil
        </button>

        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="bg-gray-900 p-8 text-white text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-3xl font-bold mb-2">Você está na Lista de Espera</h1>
            <p className="text-gray-400">A nossa IA está a analisar o seu perfil complexo.</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Porquê esperar?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Devido à alta procura e à complexidade da nossa análise psicológica, os utilizadores gratuitos entram numa fila de processamento.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-sm max-w-sm mx-auto mt-6">
                  <p className="text-sm text-yellow-800 font-medium uppercase tracking-wide mb-1">
                    Sua posição na fila
                  </p>
                  <p className="text-5xl font-black text-gray-900">
                    #{queuePosition}
                  </p>
                  <p className="text-xs text-yellow-700 mt-2 font-medium">
                    Tempo estimado: +2 semanas
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 my-8"></div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <Zap className="text-purple-600" /> Acelere o seu processo
                </h3>
                <p className="text-gray-500 mt-2">Escolha um plano para saltar a fila e ver matches hoje.</p>
              </div>

              {/* Subscriptions List Below Queue */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all relative flex flex-col bg-white">
                    {plan.label && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {plan.label}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                    <div className="my-3">
                      <span className="text-3xl font-bold">€{plan.price}</span>
                      <span className="text-gray-500 text-sm"> / {plan.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-1">{plan.description || "Acesso total à plataforma."}</p>
                    <ul className="text-xs text-gray-600 space-y-2 mb-4">
                       <li className="flex gap-2"><Check className="w-3 h-3 text-green-500"/> Saltar a fila</li>
                       <li className="flex gap-2"><Check className="w-3 h-3 text-green-500"/> Chat ilimitado</li>
                    </ul>
                    <Button onClick={onUpgrade} variant="outline" fullWidth className="mt-auto">
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER PREMIUM MATCHES ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seus Matches</h1>
            <p className="text-gray-500">Selecionados pela IA com base na sua psicologia.</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setView('PROFILE')}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
             >
                <UserIcon className="w-4 h-4" /> Perfil
            </button>
            <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium">
                <Shield className="w-4 h-4" /> Conta Premium Ativa
            </div>
          </div>
        </header>

        {loadingMatches ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">A IA está a calcular compatibilidades para {user.primaryInterest}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="h-48 bg-gray-200 relative overflow-hidden group">
                  {/* Blur effect for anonymity preview */}
                  <img src={match.avatarUrl} alt={match.name} className="w-full h-full object-cover filter blur-sm scale-110 transition-transform duration-500" />
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                      <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg max-w-[80%] text-center backdrop-blur-md shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                         O perfil só será revelado após confirmação mútua
                      </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-10">
                     <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md group-hover:opacity-0 transition-opacity">Anónimo</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-purple-600 shadow-sm z-10">
                    {match.compatibilityScore}% Compatível
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{match.name}, {match.age}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{match.interestType}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">"{match.bio}"</p>
                  <Button onClick={() => onStartChat(match)} fullWidth variant="outline" className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Iniciar Chat (24h)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};