import React, { useState, useEffect, useRef } from 'react';
import { MatchProfile, ChatMessage, InterestType } from '../types';
import { Button } from '../components/Button';
import { Send, Clock, ArrowLeft, Lock, Sparkles, MoreVertical, AlertTriangle, ShieldOff, BrainCircuit, Wand2, Fingerprint } from 'lucide-react';
import { generateDeepMatchAnalysis, generateIcebreaker } from '../services/geminiService';

interface ChatProps {
  match: MatchProfile;
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ match, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loadingIcebreaker, setLoadingIcebreaker] = useState(false);
  
  const autoReplyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Determine the system message content
    const reasoning = match.matchReasoning || generateDeepMatchAnalysis(match.interestType, match.name);
    
    setMessages([{
      id: 'system-ai-start',
      senderId: 'system',
      text: reasoning,
      timestamp: new Date(),
      isSystemMessage: true
    }]);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(timer);
      if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);
    };
  }, [match]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m restantes`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Auto reply simulation - Deeper AI response
    if (autoReplyTimeoutRef.current) clearTimeout(autoReplyTimeoutRef.current);

    autoReplyTimeoutRef.current = setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: match.id,
        text: "Essa é uma resposta interessante. A maioria das pessoas não admite isso. O que te levou a pensar assim?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 6000); // Slower response for "deep thought" feel
  };

  const handleMagicIcebreaker = async () => {
      setLoadingIcebreaker(true);
      const text = await generateIcebreaker(match.interestType, match.name);
      setInputValue(text);
      setLoadingIcebreaker(false);
  };

  const handleReport = () => {
    alert("Utilizador denunciado e bloqueado com sucesso. A segurança da equipa MeetMatch irá analisar o caso.");
    onBack();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            {/* Anonymous Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden border border-gray-100">
                <Fingerprint className="w-6 h-6 text-gray-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              Anónimo
            </h3>
            <p className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                {match.compatibilityScore}% Compatibilidade Mental
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
            <Clock className="w-3 h-3" />
            {formatTime(timeLeft)}
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-full">
               <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> Denunciar / Bloquear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="text-center space-y-2 my-6">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
            <Lock className="w-3 h-3" /> Identidades Protegidas
          </div>
          <p className="text-xs text-gray-400">
            A vossa identidade é revelada apenas se ambos concordarem.<br/>
            O foco é a mente, não a imagem.
          </p>
        </div>

        {messages.map((msg) => {
          if (msg.isSystemMessage) {
            // Enhanced "Psychological Report" Style for System Message
            return (
              <div key={msg.id} className="flex justify-center my-6 animate-fade-in">
                <div className="bg-white text-gray-800 p-6 rounded-2xl text-sm border-l-4 border-purple-600 max-w-[95%] md:max-w-[85%] shadow-md relative overflow-hidden">
                   
                   <div className="flex flex-col gap-3 relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Relatório Clínico da IA</h4>
                      </div>
                      
                      <div className="prose prose-sm text-gray-600 leading-relaxed font-serif italic border-t border-gray-100 pt-3">
                        {msg.text.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i} className="text-purple-900 font-bold not-italic font-sans block mt-3 mb-1">{part}</strong> : part
                        )}
                      </div>
                   </div>
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                isMe 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-200 safe-area-bottom">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
            <button 
                type="button" 
                onClick={handleMagicIcebreaker}
                disabled={loadingIcebreaker}
                className="group relative p-3 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border border-purple-100 hover:border-purple-300 transition-all shadow-sm"
                title="Gerar pergunta profunda"
            >
                {loadingIcebreaker ? <Sparkles className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none">
                    Gerar Pergunta Profunda
                </span>
            </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escreve algo com significado..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm"
          />
          <Button type="submit" className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
             <ShieldOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-900 mb-2">Denunciar Utilizador</h3>
             <p className="text-gray-500 text-sm mb-6">
               Tem a certeza? Esta ação é irreversível, bloqueará o utilizador e enviará uma cópia da conversa para a nossa equipa de segurança.
             </p>
             <div className="flex gap-3">
               <Button onClick={() => setShowReportModal(false)} variant="ghost" fullWidth>Cancelar</Button>
               <button 
                 onClick={handleReport}
                 className="flex-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
               >
                 Bloquear
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};