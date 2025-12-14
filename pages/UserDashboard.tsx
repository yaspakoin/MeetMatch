import React, { useState, useEffect, useRef } from 'react';
import { User, MatchProfile, InterestType } from '../types';
import { Button } from '../components/Button';
import { SUBSCRIPTION_PLANS, MOCK_AVATARS } from '../constants';
import { analyzeCompatibility, generateDeepMatchAnalysis, generateCompatibilityDetails } from '../services/geminiService';
import { Star, Clock, MessageCircle, Shield, Zap, Info, Check, User as UserIcon, Save, ArrowLeft, Camera, Upload, Lightbulb, Activity, Fingerprint, Bell, Sparkles, Settings, AlertTriangle, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

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
  const [editAvatar, setEditAvatar] = useState<string>(user.avatarUrl || "https://picsum.photos/200/200?grayscale");
  
  // Cancel Subscription State
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Free User Engagement State
  const [analysisStatus, setAnalysisStatus] = useState("A analisar micro-expressões nas respostas...");
  const [dailyInsight, setDailyInsight] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logic for Waiting List Number
  const [queuePosition] = useState(() => {
    const min = 45;
    const max = 980; 
    return Math.floor(Math.random() * (max - min + 1) + min);
  });

  const isMounted = useRef(true);

  // Calculate new matches for badges
  const newMatchesCount = matches.filter(m => m.isNew).length;

  useEffect(() => {
    isMounted.current = true;
    
    // Fake analysis steps for free users - More complex sounding
    if (!user.isPremium) {
        const statuses = [
            "A mapear traços de personalidade Big Five...",
            "A detetar dissonância cognitiva nas respostas...",
            "A comparar valores éticos fundamentais...",
            "A filtrar narcisismo oculto...",
            "A calcular coeficiente de inteligência emocional..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (isMounted.current) {
                setAnalysisStatus(statuses[i % statuses.length]);
                i++;
            }
        }, 4000);

        // Set a random psychological insight - Deeper
        const insights = [
           "A tua aversão ao risco sugere uma infância onde a estabilidade era condicional. Filtramos perfis caóticos.",
           "As tuas respostas indicam um alto nível de empatia cognitiva, mas baixa tolerância à frustração. Precisas de alguém resiliente.",
           "Detetámos uma contradição: procuras liberdade, mas as tuas respostas mostram necessidade de controlo. A IA está a ajustar o filtro.",
           "O teu perfil psicológico é raro: Idealista Pragmático. A maioria dos matches foi descartada por superficialidade."
        ];
        setDailyInsight(insights[Math.floor(Math.random() * insights.length)]);

        return () => clearInterval(interval);
    }

    return () => {
      isMounted.current = false;
    };
  }, [user.isPremium]);

  useEffect(() => {
    // Reload matches if interest changes and user is premium, or initially
    if (user.isPremium && view === 'MATCHES') {
      loadMatches();
    }
  }, [user.isPremium, user.primaryInterest, view]);

  const loadMatches = async () => {
    // Only load if empty to prevent resetting "New" status on every render, 
    // unless explicit refresh logic is added later.
    if (matches.length > 0) return;

    setLoadingMatches(true);
    // Simulate AI finding matches - NOW ANONYMOUS
    const fakeMatches: MatchProfile[] = await Promise.all([1, 2, 3].map(async (i) => {
      const score = await analyzeCompatibility(user.questionnaireAnswers || {}, user.primaryInterest || InterestType.DATING);
      // NAME IS NOW ANONYMOUS
      const matchName = `Anónimo`; 
      
      return {
        id: `match-${i}`,
        name: matchName,
        age: 0, // Hidden age or random range
        bio: "Bio oculta pela IA. A compatibilidade é baseada puramente na psique.",
        compatibilityScore: score,
        interestType: user.primaryInterest || InterestType.DATING,
        avatarUrl: MOCK_AVATARS[i],
        isNew: true, // Mark as new for badge testing
        matchReasoning: generateDeepMatchAnalysis(user.primaryInterest || InterestType.DATING, matchName),
        compatibilityDetails: generateCompatibilityDetails(score), // Generate Radar Data
        instagram: `bloqueado`,
        phoneNumber: `bloqueado`
      };
    }));

    if (isMounted.current) {
      setMatches(fakeMatches);
      setLoadingMatches(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
      if (onUpdateUser) {
          onUpdateUser({
              ...user,
              name: editName,
              age: parseInt(editAge),
              bio: editBio,
              primaryInterest: editInterest,
              avatarUrl: editAvatar
          });
          alert("Perfil atualizado com sucesso!");
          setView('MATCHES');
          // Reset matches to force reload on next view if interest changed (simplified logic)
          if (editInterest !== user.primaryInterest) {
             setMatches([]);
          }
      }
  };

  const handleCancelSubscription = () => {
    if (onUpdateUser) {
        onUpdateUser({
            ...user,
            isPremium: false
        });
        setShowCancelModal(false);
        setView('MATCHES'); // This will trigger the Free view render
        setMatches([]); // Clear premium matches
    }
  };

  // --- RENDER PROFILE VIEW ---
  if (view === 'PROFILE') {
      return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setView('MATCHES')} className="p-2 hover:bg-gray-100 rounded-full relative group">
                        <ArrowLeft className="w-5 h-5 text-gray-600"/>
                        {/* Notification Dot on Back Button */}
                        {newMatchesCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Voltar aos Matches
                        </span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">O Meu Perfil</h1>
                </div>

                <div className="space-y-6">
                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                          <img 
                            src={editAvatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white shadow-lg border-2 border-white">
                          <Upload className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Clique para alterar a foto</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>

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

                    {/* HIDDEN CANCEL SECTION */}
                    {user.isPremium && (
                        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Zona de Faturação</h4>
                            <div className="bg-gray-50 rounded-lg p-4 w-full text-center">
                                <p className="text-xs text-gray-500 mb-3">Plano Premium Ativo</p>
                                <button 
                                    onClick={() => setShowCancelModal(true)}
                                    className="text-[10px] text-gray-400 hover:text-red-500 transition-colors underline decoration-gray-300 hover:decoration-red-500"
                                >
                                    Gerir ou cancelar subscrição
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Subscription Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative overflow-hidden">
                        <button 
                            onClick={() => setShowCancelModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Vai mesmo desistir?</h3>
                            <p className="text-gray-500 text-sm">
                                Ao cancelar, perderá imediatamente o acesso aos seus matches compatíveis e voltará para o <span className="font-bold text-gray-900">fim da lista de espera (#984)</span>.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button 
                                onClick={() => setShowCancelModal(false)} 
                                fullWidth 
                                className="bg-green-600 hover:bg-green-700 border-none shadow-green-200"
                            >
                                Manter os meus benefícios
                            </Button>
                            
                            <button 
                                onClick={handleCancelSubscription}
                                className="w-full py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                Sim, quero cancelar tudo
                            </button>
                        </div>
                        
                        <p className="text-[10px] text-center text-gray-400 mt-4">
                            Esta ação é irreversível. O histórico de conversas será arquivado.
                        </p>
                    </div>
                </div>
            )}
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
            {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="Profile" />
            ) : (
                <UserIcon className="w-4 h-4" /> 
            )}
            Perfil
        </button>

        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
          <div className="bg-gray-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
            </div>
            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-3xl font-bold mb-2">Análise em Progresso</h1>
            <p className="text-gray-400 flex items-center justify-center gap-2 text-sm animate-pulse">
                <Activity className="w-4 h-4" /> {analysisStatus}
            </p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              
              {/* Daily Insight Card */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative">
                <div className="absolute -top-3 -left-3 bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
                    <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-indigo-900 ml-6 mb-2">Relatório Psicológico Preliminar</h4>
                <p className="text-indigo-700 text-sm italic font-medium leading-relaxed">"{dailyInsight}"</p>
                <p className="text-xs text-indigo-400 mt-2 text-right">IA Core v2.4 • Processado agora</p>
              </div>

              <div className="text-center">
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

              {/* Subscriptions List */}
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
                       <li className="flex gap-2"><Check className="w-3 h-3 text-green-500"/> Radar de Compatibilidade</li>
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
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Seus Matches</h1>
              {newMatchesCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse border border-red-200">
                  {newMatchesCount} Novos
                </span>
              )}
            </div>
            <p className="text-gray-500">Selecionados pela IA com base na sua psicologia.</p>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Notification Bell */}
             <div className="relative p-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Bell className="w-5 h-5 text-gray-500" />
                {newMatchesCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
             </div>

             <button 
                onClick={() => setView('PROFILE')}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
             >
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="Profile" />
                ) : (
                    <UserIcon className="w-4 h-4" /> 
                )}
                Perfil
            </button>
            <div className="hidden md:flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium text-sm">
                <Shield className="w-4 h-4" /> Premium
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
              <div key={match.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col relative group">
                
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {/* Heavily Blurred effect for anonymity */}
                  <img src={match.avatarUrl} alt={match.name} className="w-full h-full object-cover filter blur-md scale-110 transition-transform duration-500" />
                  
                  {/* New Match Badge - Discrete but visual */}
                  {match.isNew && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5 ring-2 ring-white/30 backdrop-blur-sm animate-pulse-slow">
                       <Sparkles className="w-3 h-3 text-yellow-200 fill-current" /> NOVO
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center z-10 flex-col gap-2">
                     <Fingerprint className="w-12 h-12 text-white/80" />
                     <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md uppercase tracking-widest font-bold">Identidade Oculta</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-purple-600 shadow-sm z-10">
                    {match.compatibilityScore}%
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{match.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{match.interestType}</span>
                  </div>
                  {/* Hide Bio content visually with a blur text effect or generic message */}
                  <p className="text-gray-500 text-sm mb-4 italic">
                    "Este perfil corresponde 98% aos teus valores fundamentais de lealdade e ambição."
                  </p>

                  {/* RADAR CHART for Premium Users */}
                  {match.compatibilityDetails && (
                    <div className="h-40 w-full mb-4 relative">
                        <p className="text-xs text-center text-gray-400 mb-1 uppercase tracking-wide">Radar de Afinidade</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={match.compatibilityDetails}>
                                <PolarGrid gridType="polygon" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name={match.name}
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="#8b5cf6"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button onClick={() => onStartChat(match)} fullWidth variant="outline" className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Iniciar Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};