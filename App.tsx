import React, { useState } from 'react';
import { User, UserRole, MatchProfile, InterestType } from './types';
import { Login } from './pages/Login';
import { Questionnaire } from './pages/Questionnaire';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Chat } from './pages/Chat';
import { SUBSCRIPTION_PLANS } from './constants';
import { X, EyeOff, Check, Loader2 } from 'lucide-react';
import { Button } from './components/Button';

type PreviewMode = 'FREE' | 'PREMIUM' | null;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<MatchProfile | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Admin Preview Mode
  const [adminPreviewMode, setAdminPreviewMode] = useState<PreviewMode>(null);

  const handleLogin = (user: User) => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setCurrentUser(user);
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChat(null);
    setShowPaymentModal(false);
    setAdminPreviewMode(null);
  };

  const handleQuestionnaireComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId);
    
    // Simulate payment
    if (currentUser) {
      if (adminPreviewMode === 'FREE') {
        setAdminPreviewMode('PREMIUM');
        setShowPaymentModal(false);
        alert(`Simulação: Upgrade para plano ${plan?.name} realizado com sucesso!`);
        return;
      }

      setCurrentUser({ ...currentUser, isPremium: true });
      setShowPaymentModal(false);
      alert(`Upgrade realizado com sucesso! Bem-vindo ao plano ${plan?.name}.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  // --- RENDER LOGIC ---

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Admin View Logic
  if (currentUser.role === UserRole.ADMIN && !adminPreviewMode) {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
        onStartPreview={(mode) => setAdminPreviewMode(mode)} 
      />
    );
  }

  // Admin Preview Mode or Regular User View
  const isPreview = currentUser.role === UserRole.ADMIN && adminPreviewMode !== null;
  
  // If previewing, use a mock user profile based on selected mode
  const userToRender = isPreview ? {
    ...currentUser,
    isPremium: adminPreviewMode === 'PREMIUM', // True if Premium mode, False if Free mode
    primaryInterest: InterestType.DATING,
    questionnaireAnswers: { "Demo": "Sim" }
  } : currentUser;

  // Render content based on state
  const renderContent = () => {
    if (!userToRender.questionnaireAnswers || Object.keys(userToRender.questionnaireAnswers).length === 0) {
      return <Questionnaire user={userToRender} onComplete={handleQuestionnaireComplete} />;
    }

    if (activeChat) {
      return <Chat match={activeChat} onBack={() => setActiveChat(null)} />;
    }

    return (
      <UserDashboard 
        user={userToRender} 
        onUpgrade={handleUpgrade} 
        onStartChat={setActiveChat}
        onUpdateUser={handleUserUpdate}
      />
    );
  };

  return (
    <>
      {/* Admin Preview Banner Overlay */}
      {isPreview && (
        <div className={`fixed top-0 left-0 right-0 text-white z-50 px-4 py-2 flex justify-between items-center shadow-md ${adminPreviewMode === 'PREMIUM' ? 'bg-red-600' : 'bg-orange-500'}`}>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <EyeOff className="w-4 h-4" />
            Modo de Simulação: Cliente {adminPreviewMode === 'PREMIUM' ? 'Premium' : 'Grátis'}
          </div>
          <div className="flex gap-2">
             {adminPreviewMode === 'FREE' && (
                <span className="text-xs bg-black/20 px-2 py-1 rounded flex items-center">
                  Tente fazer upgrade para testar o fluxo
                </span>
             )}
            <button 
              onClick={() => {
                setAdminPreviewMode(null);
                setActiveChat(null); // Reset chat if open
              }}
              className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              Sair da Simulação
            </button>
          </div>
        </div>
      )}

      {/* Main App Content (pushed down if previewing) */}
      <div className={isPreview ? "mt-10" : ""}>
        {renderContent()}
      </div>

      {/* Subscription Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative overflow-hidden">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Escolhe o teu plano</h2>
              <p className="text-gray-600">Desbloqueia matches ilimitados e salta a fila de espera.</p>
            </div>

            <div className="space-y-3 mb-6">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-600 bg-purple-50 shadow-md' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {plan.label && (
                      <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {plan.label}
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <h3 className={`font-bold ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                            {plan.name}
                          </h3>
                          <p className="text-xs text-gray-500">{plan.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">€{plan.price}</span>
                        <span className="text-xs text-gray-500 block">total</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={processPayment} fullWidth size="lg" className="py-4 text-lg">
              Começar Agora
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Pagamento seguro. Podes cancelar a qualquer momento.
            </p>

            {isPreview && (
              <p className="text-xs text-center text-red-500 mt-2 font-mono bg-red-50 p-1 rounded">
                [SIMULAÇÃO] Admin Mode Active
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default App;