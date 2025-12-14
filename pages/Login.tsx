import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { Lock, Mail, User as UserIcon, Briefcase, Heart, BrainCircuit, Loader2 } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PASS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Simple Google Icon SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate Network Request
    setTimeout(() => {
        onLogin({
            id: 'mock-user-google-1',
            email: 'user@gmail.com',
            name: 'Utilizador Google',
            role: UserRole.USER,
            isPremium: false,
            createdAt: new Date()
        });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate Network Request
    setTimeout(() => {
        // ADMIN CHECK
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
            onLogin({
                id: 'admin-1',
                email: ADMIN_EMAIL,
                name: 'Serhiy Admin',
                role: UserRole.ADMIN,
                isPremium: true,
                createdAt: new Date()
            });
            return;
        }

        // REGULAR USER VALIDATION
        if (isLogin) {
            if (email && password) {
                onLogin({
                    id: 'user-' + Date.now(),
                    email: email,
                    name: 'Utilizador Demo',
                    role: UserRole.USER,
                    isPremium: false,
                    createdAt: new Date()
                });
            } else {
                setError('Preencha todos os campos.');
                setIsLoading(false);
            }
        } else {
            // REGISTER
            if (email && password && name) {
                 onLogin({
                    id: 'user-' + Date.now(),
                    email: email,
                    name: name,
                    role: UserRole.USER,
                    isPremium: false,
                    createdAt: new Date()
                });
            } else {
                setError('Preencha todos os campos.');
                setIsLoading(false);
            }
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-inter">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Brand & Vision */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">MeetMatch.</h1>
            <p className="text-white/70 text-sm font-medium">Intelligence Driven Connections</p>
          </div>

          <div className="relative z-10 my-10 space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Encontre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Match Perfeito</span> para cada área da sua vida.
            </h2>
            
            <div className="space-y-4">
               <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                  <div className="bg-pink-500/20 p-2 rounded-lg text-pink-300">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Amor & Relações</p>
                    <p className="text-xs text-white/60">Compatibilidade emocional profunda.</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-300">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Networking & Carreira</p>
                    <p className="text-xs text-white/60">Parceiros de negócio e oportunidades.</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-300">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Mentoria & Evolução</p>
                    <p className="text-xs text-white/60">Aprenda com quem já chegou lá.</p>
                  </div>
               </div>
            </div>
          </div>

          <p className="text-xs text-white/40 relative z-10">
            Powered by Gemini AI • Psicologia Avançada • 100% Anónimo
          </p>
        </div>
        
        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Comece a sua jornada'}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              {isLogin ? 'Aceda à sua conta para ver novos matches.' : 'Junte-se a milhares de pessoas à procura de conexões reais.'}
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-6 shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              <span className="group-hover:text-gray-900">Continuar com Google</span>
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                <span className="px-3 bg-white text-gray-400">Ou continuar com email</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
                   <div className="relative group">
                    <UserIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Como quer ser chamado?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                   <label className="block text-sm font-medium text-gray-700">Senha</label>
                   {isLogin && <a href="#" className="text-xs text-purple-600 hover:text-purple-800 font-medium">Esqueceu?</a>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-purple-600 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100"
                  />
                </div>
              </div>

              <Button type="submit" fullWidth disabled={isLoading} className="py-3 text-base shadow-purple-500/25 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLogin ? 'Entrar na Plataforma' : 'Criar Conta Gratuita'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-purple-600 hover:text-purple-800 font-bold hover:underline"
                >
                  {isLogin ? 'Registar' : 'Fazer Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};