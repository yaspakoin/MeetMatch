export const ADMIN_EMAIL = "serhiy.lunhu@gmail.com";
export const ADMIN_PASS = "admin123";

// Pricing Plans
export const SUBSCRIPTION_PLANS = [
  { id: 'weekly', name: 'Semanal', price: 3.99, duration: '1 semana', description: 'Para quem quer experimentar.' },
  { id: 'monthly', name: 'Mensal', price: 9.99, duration: '1 mês', label: 'Popular', description: 'Tempo ideal para encontrar conexões.' },
  { id: 'quarterly', name: 'Trimestral', price: 19.99, duration: '3 meses', label: 'Melhor Valor (-33%)', description: 'Para quem leva o amor a sério.' },
];

export const SUBSCRIPTION_PRICE = 9.99; // Fallback legacy reference

export const MOCK_AVATARS = [
  "https://picsum.photos/200/200?random=1",
  "https://picsum.photos/200/200?random=2",
  "https://picsum.photos/200/200?random=3",
  "https://picsum.photos/200/200?random=4",
];

export const LANGUAGES = [
  "Português", "Inglês", "Espanhol", "Francês", "Alemão", 
  "Italiano", "Mandarim", "Russo", "Árabe", "Hindi", "Japonês"
];

export const COUNTRIES = [
  "Portugal", "Brasil", "Angola", "Moçambique", "Cabo Verde", "Estados Unidos", 
  "Reino Unido", "Espanha", "França", "Alemanha", "Itália", "Suíça", "Canadá", 
  "Austrália", "Japão", "China", "Índia", "Rússia", "Ucrânia", "Polónia", 
  "Holanda", "Bélgica", "Suécia", "Noruega", "Dinamarca", "Finlândia", 
  "Irlanda", "Áustria", "Grécia", "Turquia", "Egito", "África do Sul", 
  "Emirados Árabes Unidos", "Arábia Saudita", "Argentina", "Chile", "Colômbia", 
  "México", "Peru", "Tailândia", "Indonésia", "Coreia do Sul", "Nova Zelândia"
].sort();

// Structured locations map for filtering
export const LOCATIONS_BY_COUNTRY: Record<string, string[]> = {
  "Portugal": [
    "Lisboa", "Lisboa - Arroios", "Lisboa - Belém", "Lisboa - Santa Maria Maior", "Lisboa - Parque das Nações",
    "Porto", "Porto - Paranhos", "Porto - Foz do Douro", "Porto - Cedofeita",
    "Sintra", "Sintra - Queluz", "Sintra - Algueirão-Mem Martins",
    "Cascais", "Cascais - Estoril", "Cascais - Carcavelos",
    "Coimbra", "Coimbra - Santo António dos Olivais",
    "Braga", "Aveiro", "Faro", "Setúbal", "Viseu", "Leiria", "Évora", 
    "Funchal", "Ponta Delgada", "Guimarães", "Almada", "Amadora", "Odivelas"
  ],
  "Brasil": [
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Belo Horizonte", 
    "Curitiba", "Manaus", "Recife", "Porto Alegre", "Fortaleza"
  ],
  "Angola": ["Luanda", "Benguela", "Huambo", "Lobito", "Lubango"],
  "Moçambique": ["Maputo", "Beira", "Nampula", "Chimoio", "Nacala"],
  "Reino Unido": ["Londres", "Manchester", "Birmingham", "Liverpool", "Edimburgo"],
  "França": ["Paris", "Lyon", "Marselha", "Toulouse", "Bordéus"],
  "Espanha": ["Madrid", "Barcelona", "Valência", "Sevilha", "Bilbau"],
  "Estados Unidos": ["Nova Iorque", "Los Angeles", "Chicago", "Houston", "Miami"],
  // Fallback for others (generic major cities)
  "Outro": ["Capital", "Cidade Principal"]
};

// Helper to get locations safely
export const getLocationsForCountry = (country: string): string[] => {
  return LOCATIONS_BY_COUNTRY[country] || LOCATIONS_BY_COUNTRY["Outro"] || [];
};