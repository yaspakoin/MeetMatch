import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats } from '../types';
import { Users, CreditCard, HeartHandshake, LogOut, TrendingUp, Activity, Smartphone, Eye, Lock, ShieldCheck, Hourglass } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onStartPreview: (mode: 'PREMIUM' | 'FREE') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onStartPreview }) => {
  // Mock Stats - Now with 'Waiting List'
  const stats: DashboardStats = {
    totalMatches: 1250,
    successfulMatches: 843,
    rejectedMatches: 407,
    revenue: 15420, // Euro
    activeUsers: 3200,
    waitingListCount: 2357, // Calculated metric (Real count of people on waitlist)
    aiTokensUsed: 4500000
  };

  const chartData = [
    { name: 'Jan', matches: 400, revenue: 2400 },
    { name: 'Fev', matches: 300, revenue: 1398 },
    { name: 'Mar', matches: 200, revenue: 9800 },
    { name: 'Abr', matches: 278, revenue: 3908 },
    { name: 'Mai', matches: 189, revenue: 4800 },
    { name: 'Jun', matches: 239, revenue: 3800 },
  ];

  const interestData = [
    { name: 'Namoro', value: 45 },
    { name: 'Amizade', value: 25 },
    { name: 'Networking', value: 20 },
    { name: 'Mentoria', value: 10 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {subtext && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {subtext}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg font-bold">MM</div>
           <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm text-gray-500">Logado como: <span className="font-semibold text-gray-800">Serhiy Admin</span></span>
           <button 
             onClick={onLogout}
             className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
           >
             <LogOut className="w-4 h-4" />
             Sair
           </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Actions Row */}
        <div className="mb-8 flex flex-col md:flex-row justify-end gap-4">
            <div className="flex items-center gap-2 mr-auto">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quality Assurance / Preview</span>
            </div>

            <button 
              onClick={() => onStartPreview('FREE')}
              className="group flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl shadow-sm transition-all transform hover:-translate-y-1"
            >
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gray-200">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-semibold">Conta Free</p>
                <p className="text-sm font-bold flex items-center gap-2">
                  Ver Lista Espera <Eye className="w-3 h-3" />
                </p>
              </div>
            </button>

            <button 
              onClick={() => onStartPreview('PREMIUM')}
              className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase font-semibold">Conta Premium</p>
                <p className="text-sm font-bold flex items-center gap-2">
                  Ver Matches <Eye className="w-3 h-3" />
                </p>
              </div>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Lista de Espera" 
            value={stats.waitingListCount.toLocaleString()} 
            icon={Hourglass} 
            color="bg-yellow-500" 
            subtext="Usuários aguardando match"
          />
          <StatCard 
            title="Receita Total (MRR)" 
            value={`€${stats.revenue.toLocaleString()}`} 
            icon={CreditCard} 
            color="bg-green-500" 
            subtext="+12% vs mês anterior"
          />
          <StatCard 
            title="Matches Sucesso" 
            value={stats.successfulMatches} 
            icon={HeartHandshake} 
            color="bg-purple-500"
            subtext="67% Taxa de aceitação" 
          />
          <StatCard 
            title="Utilizadores Ativos" 
            value={stats.activeUsers} 
            icon={Users} 
            color="bg-blue-500"
            subtext="321 novos hoje" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Crescimento de Receita (6 Meses)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição de Interesses</h3>
            <p className="text-sm text-gray-500 mb-4">O que os seus utilizadores estão realmente à procura.</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interestData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {interestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Fluxo de Matches</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Legend />
                  <Bar dataKey="matches" fill="#ec4899" radius={[4, 4, 0, 0]} name="Matches Gerados" />
                </BarChart>
              </ResponsiveContainer>
            </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                   Insights da IA
                   <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Beta</span>
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 min-w-[6px] h-6 rounded-full bg-red-500"></div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Alerta de Churn:</span> 
                      Taxa de rejeição em "Mentoria" subiu 15% esta semana. Sugestão: Ajustar algoritmo para exigir mais experiência no perfil.
                    </p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 min-w-[6px] h-6 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Oportunidade:</span> 
                      Utilizadores em "Portugal" têm 2x mais probabilidade de comprar Boost à noite.
                    </p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1 min-w-[6px] h-6 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Custo API:</span> 
                      Otimização do prompt reduziu o uso de tokens em 8%.
                    </p>
                  </li>
                </ul>
              </div>
              <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Ver relatório completo
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};