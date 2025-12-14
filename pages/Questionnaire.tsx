import React, { useState, useEffect } from 'react';
import { User, InterestType } from '../types';
import { Button } from '../components/Button';
import { generatePsychologicalQuestions } from '../services/geminiService';
import { MapPin, Globe, Loader2, BrainCircuit, Calendar } from 'lucide-react';
import { COUNTRIES, LANGUAGES, getLocationsForCountry } from '../constants';

interface QuestionnaireProps {
  user: User;
  onComplete: (updatedUser: User) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Basics
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<string>(''); // Age state
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Step 2: Interest
  const [interest, setInterest] = useState<InterestType | null>(null);
  
  // Step 3: AI Questions
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Auto-detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('pt')) setLanguage('Português');
    else if (browserLang.startsWith('en')) setLanguage('Inglês');
    else if (browserLang.startsWith('es')) setLanguage('Espanhol');
    else if (browserLang.startsWith('fr')) setLanguage('Francês');
    else if (browserLang.startsWith('de')) setLanguage('Alemão');
    else if (browserLang.startsWith('it')) setLanguage('Italiano');
  }, []);

  const handleDemographicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    if (!age || ageNum < 18) {
      alert("É necessário ter mais de 18 anos.");
      return;
    }
    if (country && language && location) setStep(2);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setLocation('');
    setLocationSuggestions([]);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 0 && country) {
      const availableLocations = getLocationsForCountry(country);
      const filtered = availableLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  const handleInterestSelect = async (selected: InterestType) => {
    setInterest(selected);
    setLoading(true);
    // Fetch AI questions based on interest
    const aiQuestions = await generatePsychologicalQuestions(selected);
    setQuestions(aiQuestions);
    setLoading(false);
    setStep(3);
  };

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleFinalSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Por favor responda a todas as questões para uma análise precisa.");
      return;
    }

    const updatedUser: User = {
      ...user,
      country,
      language,
      location,
      age: parseInt(age),
      primaryInterest: interest!,
      questionnaireAnswers: answers
    };
    onComplete(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">A criar perguntas únicas para ti...</h2>
        <p className="text-gray-500">A IA está a analisar o contexto de {interest}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="text-purple-600" /> Quem é você?
            </h2>
            <form onSubmit={handleDemographicsSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <div className="relative">
                    <select
                        required
                        value={country}
                        onChange={handleCountryChange}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 pr-10 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                    >
                        <option value="">Selecione o seu país...</option>
                        {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            required
                            type="number"
                            min="18"
                            max="99"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ex: 25"
                        />
                    </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {country === 'Portugal' ? 'Localização (Cidade, Concelho ou Freguesia)' : 'Localização (Cidade)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={location} 
                    onChange={handleLocationChange}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    disabled={!country}
                    className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                    placeholder={!country ? "Selecione o país primeiro" : "Escreva para ver sugestões..."} 
                    autoComplete="off"
                  />
                </div>
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {locationSuggestions.map((city, index) => (
                      <li 
                        key={index}
                        onClick={() => selectSuggestion(city)}
                        className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idioma Principal</label>
                <select
                  required
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                >
                  <option value="">Qual a língua que falas melhor?</option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" fullWidth>Próximo Passo</Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BrainCircuit className="text-purple-600" /> O que procuras hoje?
            </h2>
            <p className="text-gray-600 mb-8">
              A nossa IA vai criar perguntas específicas para ti, agora mesmo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(InterestType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleInterestSelect(type)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                >
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700">{type}</h3>
                  <p className="text-sm text-gray-500 mt-2">Clique para iniciar a análise.</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Análise Profunda</h2>
            <p className="text-sm text-gray-500 mb-6">Responde com honestidade. Não há respostas certas ou erradas.</p>
            
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="block text-lg font-medium text-gray-800 mb-3 leading-relaxed">
                    {idx + 1}. {q}
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Escreve aqui o que sentes..."
                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                    value={answers[q] || ''}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button onClick={handleFinalSubmit} fullWidth size="lg">
                Finalizar e Encontrar Matches
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};