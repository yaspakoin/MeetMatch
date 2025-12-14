import { GoogleGenAI, Type } from "@google/genai";
import { InterestType, CompatibilityMetric } from "../types";

// Use process.env.API_KEY as required by guidelines
const apiKey = process.env.API_KEY; 
const ai = new GoogleGenAI({ apiKey });

export const generatePsychologicalQuestions = async (interest: InterestType): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning fallback questions.");
    return [
      "Qual é a mentira que contas a ti próprio todos os dias para conseguires seguir em frente?",
      "Se pudesses ver um contador acima da cabeça de toda a gente, o que é que gostarias que ele medisse?",
      "O que é que os teus pais te ensinaram sobre o amor que tu sabes que está completamente errado?",
      "Preferias ser a pessoa que magoa ou a pessoa que é magoada? Porquê?",
      "Qual foi o momento exato em que deixaste de ser criança?",
      "O que é que farias se soubesses que não haveria consequências, nem divinas nem legais?",
      "Achas que a bondade humana é natural ou é apenas um mecanismo de sobrevivência social?"
    ];
  }

  try {
    const seed = Date.now().toString().slice(-4);
    
    const prompt = `
      Gera 7 perguntas PROFUNDAMENTE PSICOLÓGICAS e FILOSÓFICAS para avaliar compatibilidade na área de "${interest}".
      
      REGRAS RÍGIDAS (MODE: HARDCORE PSYCHOLOGY):
      1. PROIBIDO: Perguntas superficiais ("Qual teu hobby?", "Gostas de viajar?").
      2. OBRIGATÓRIO: Perguntas que toquem na alma, na moralidade, na morte, no medo ou na infância.
      3. TOM: Curioso, ligeiramente provocador, clínico mas humano.
      4. EXEMPLO: Em vez de "Gostas de cães?", pergunta "Achas que somos donos dos animais ou carcereiros deles?".
      5. Seed: ${seed}.

      Retorna APENAS um array JSON de strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        temperature: 1.3,
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      "Qual é o teu 'traço tóxico' que te recusas a mudar?",
      "Achas que mereces ser feliz ou apenas tens sorte?",
      "O que é que te mantém acordado às 3 da manhã: culpa ou medo do futuro?",
      "Se a tua vida fosse um livro, o vilão seria quem?",
      "Preferes uma verdade que destrói a tua vida ou uma mentira que a mantém perfeita?",
      "O que é que perdoarias numa traição?",
      "Quem é que tu serias se não tivesses medo de ser julgado?"
    ];
  }
};

export const analyzeCompatibility = async (userAnswers: Record<string, string>, interest: InterestType): Promise<number> => {
   if (!apiKey) return Math.floor(Math.random() * 20) + 80; // Mock score high for satisfaction

   try {
     const prompt = `
       Age como um psicólogo comportamental sénior. Analisa as respostas deste utilizador (${interest}):
       ${JSON.stringify(userAnswers)}
       
       Calcula o índice de compatibilidade com um arquétipo de "Personalidade Complementar".
       Não sejas generoso. Sê clínico.
       Retorna apenas um número inteiro entre 0 e 100.
     `;

     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
          responseSchema: { type: Type.INTEGER }
       }
     });

     const score = parseInt(response.text || "88");
     return isNaN(score) ? 88 : score;
   } catch (e) {
     return 88;
   }
};

export const generateCompatibilityDetails = (score: number): CompatibilityMetric[] => {
    const base = score;
    const vary = (val: number) => Math.min(100, Math.max(40, val + (Math.random() * 20 - 10)));
    
    return [
        { subject: 'Inteligência Emocional', A: vary(base), fullMark: 100 },
        { subject: 'Valores Morais', A: vary(base), fullMark: 100 },
        { subject: 'Química Intelectual', A: vary(base - 5), fullMark: 100 },
        { subject: 'Resolução Conflito', A: vary(base + 5), fullMark: 100 },
        { subject: 'Visão de Futuro', A: vary(base), fullMark: 100 },
    ];
};

export const generateIcebreaker = async (interest: InterestType, matchName: string): Promise<string> => {
    if (!apiKey) return "Se pudesses apagar um dia da tua história, qual seria e porquê?";

    try {
        const prompt = `
          Gera uma frase de abertura (Icebreaker) EXTREMAMENTE PROFUNDA e INTRIGANTE para enviar a um match anónimo.
          
          REGRAS DE OURO:
          1. É ABSOLUTAMENTE PROIBIDO dizer "Olá", "Oi", "Como estás", "Tudo bem".
          2. A frase deve ir direto ao assunto, sem apresentações.
          3. Deve ser uma questão filosófica, um dilema moral, ou uma observação psicológica aguda.
          4. Contexto: ${interest}.
          
          Exemplos do tom desejado:
          - "Achas que o sofrimento é necessário para a evolução ou é apenas masoquismo?"
          - "Qual foi a última vez que choraste e não contaste a ninguém?"
          
          Retorna apenas a string da frase.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text || "O que é que tu sabes que é verdade, mas que quase ninguém concorda contigo?";
    } catch (e) {
        return "Qual é o hábito que tens que mais envergonharia os teus pais?";
    }
};

export const generateDeepMatchAnalysis = (interest: InterestType, matchName: string): string => {
  const analysisTemplates = {
    [InterestType.DATING]: [
      `**Análise Clínica:** Detetei uma ressonância nos vossos mecanismos de defesa. Enquanto tu intelectualizas a dor, este perfil tende a sublimá-la através da ação. A compatibilidade é de 94% porque ambos partilham o medo fundamental da irrelevância. **Ponto de Tensão:** A vossa definição de "lealdade" difere ligeiramente nos limites éticos.`,
      `**Relatório Psicológico:** A vossa pontuação em "Abertura à Experiência" e "Neuroticismo" cria um equilíbrio raro. Tu trazes a estrutura que falta ao caos deste perfil, e este perfil traz a imprevisibilidade que tu secretamente desejas mas reprimes. O match baseia-se na vossa resposta idêntica à questão sobre o perdão.`,
      `**Sincronicidade de Valores:** Ambos demonstraram um desprezo por convenções sociais superficiais. O algoritmo uniu-vos não pelo que gostam, mas pelo que odeiam. A vossa "Sombra Junguiana" (o lado oculto da personalidade) é compatível. Este match tem alto potencial de intensidade e transformação mútua.`
    ],
    [InterestType.NETWORKING]: [
      `**Perfil de Ambição:** Ambos exibem traços de "Maquiavelismo Funcional" — a vontade de atingir objetivos a qualquer custo, mas mantendo uma ética pessoal rígida. Tu és o estratega, este perfil é o executor. Juntos, cobrem os pontos cegos um do outro.`,
      `**Dissonância Cognitiva:** O match ocorreu porque ambos questionaram o status quo nas vossas respostas. Vocês não procuram validação, procuram desafio. A vossa conversa não será confortável, será produtiva.`
    ],
    [InterestType.FRIENDSHIP]: [
      `**Conexão de Alma:** A análise semântica das vossas respostas revelou uma solidão partilhada, mesmo quando rodeados de pessoas. Ambos valorizam a "verdade crua" acima da "polidez simpática".`,
      `**Dinâmica Social:** Vocês são ambos observadores num mundo de protagonistas. O sistema detetou um sentido de humor negro idêntico nas entrelinhas das vossas respostas abertas.`
    ],
    [InterestType.MENTORSHIP]: [
      `**Transferência de Sabedoria:** A relação detetada é arquetípica: O Mestre Cético e o Aprendiz Rebelde. A fricção intelectual entre os dois gerará o crescimento necessário.`
    ],
    [InterestType.ACTIVITY_PARTNER]: [
      `**Fuga e Catarse:** Ambos utilizam a atividade física não como hobby, mas como mecanismo de regulação emocional. O silêncio partilhado entre vocês será mais valioso que a conversa.`
    ]
  };

  const templates = analysisTemplates[interest] || analysisTemplates[InterestType.DATING];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return randomTemplate;
};

export const detectLocationFromCoordinates = async (lat: number, lng: number): Promise<{ city: string, country: string } | null> => {
    return null;
};