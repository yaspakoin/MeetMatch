import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats } from '../types';
import { Users, CreditCard, HeartHandshake, LogOut, TrendingUp, Activity, Smartphone, Eye, Lock, ShieldCheck, Hourglass, Database, Search, MoreHorizontal, LayoutDashboard } from 'lucide-react';
import { MOCK_AVATARS } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
  onStartPreview: (mode: 'PREMIUM' | 'FREE') => void;
}

// Mock User Database for Backend View
const MOCK_USERS_DB = [
  { id: 'usr_1', name: 'Ana Pereira', email: 'ana.p@gmail.com', plan: 'Premium', status: 'Active', joined: '2024-05-12', interest: 'Namoro', avatar: MOCK_AVATARS[0] },
  { id: 'usr_2', name: 'Carlos Mendes', email: 'carlos.m@hotmail.com', plan: 'Free', status: 'Waiting List', joined: '2024-05-14', interest: 'Networking', avatar: MOCK_AVATARS[1] },
  { id: 'usr_3', name: 'Beatriz Costa', email: 'bia.costa@sapo.pt', plan: 'Free', status: 'Waiting List', joined: '2024-05-15', interest: 'Amizade', avatar: MOCK_AVATARS[2] },
  { id: 'usr_4', name: 'João Silva', email: 'joao.silva@gmail.com', plan: 'Premium', status: 'Active', joined: '2024-05-10', interest: 'Namoro', avatar: MOCK_AVATARS[3] },
  { id: 'usr_5', name: 'Sofia R.', email: 'sofia.r@outlook.com', plan: 'Premium', status: 'Active', joined: '2024-05-11', interest: 'Mentoria', avatar: null },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onStartPreview }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DATABASE'>('OVERVIEW');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUsers = MOCK_USERS_DB.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg font-bold shadow-lg shadow-purple-500/30">MM</div>
           <h1 className="text-xl font-bold text-gray-900 tracking-tight">Backend Control Panel</h1>
           <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded border border-gray-200">v2.4.0</span>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'OVERVIEW' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('DATABASE')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'DATABASE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Database className="w-4 h-4" /> Base de Dados
            </button>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-800">Serhiy Admin</p>
              <p className="text-xs text-green-500">System Online</p>
           </div>
           <button 
             onClick={onLogout}
             className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
           >
             <LogOut className="w-4 h-4" />
             Sair
           </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full">
        
        {/* Actions Row - Always Visible */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
               <ShieldCheck className="text-purple-600 w-5 h-5" />
               <span className="font-semibold text-gray-700">Ferramentas de Simulação (Debug)</span>
            </div>
            <div className="flex gap-3">
                <button 
                onClick={() => onStartPreview('FREE')}
                className="group flex items-center gap-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                    <Eye className="w-4 h-4 text-gray-500" /> Ver como User Grátis
                </button>

                <button 
                onClick={() => onStartPreview('PREMIUM')}
                className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all"
                >
                    <Eye className="w-4 h-4 text-purple-400" /> Ver como User Premium
                </button>
            </div>
        </div>

        {activeTab === 'OVERVIEW' ? (
            <>
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
            </>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Gestão de Utilizadores</h3>
                        <p className="text-sm text-gray-500">Total de registos: {stats.activeUsers}</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Procurar email ou nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 outline-none"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Utilizador</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Plano</th>
                                <th className="px-6 py-4">Interesse</th>
                                <th className="px-6 py-4">Data Registo</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {user.status === 'Active' ? 'Ativo' : 'Lista Espera'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 ${user.plan === 'Premium' ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
                                            {user.plan === 'Premium' && <ShieldCheck className="w-3 h-3" />}
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.interest}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{user.joined}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Nenhum utilizador encontrado com "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};