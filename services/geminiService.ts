import { GoogleGenAI, Type } from "@google/genai";
import { InterestType } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generatePsychologicalQuestions = async (interest: InterestType): Promise<string[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning fallback questions.");
    return [
      "O que te dói mais: falhar com os outros ou falhar contigo mesmo?",
      "Quando te sentes sozinho, preferes companhia ou silêncio?",
      "Qual foi a última coisa que mudaste na tua personalidade e porquê?",
      "Achas que o amor é uma escolha diária ou um sentimento incontrolável?",
      "Se pudesses apagar uma memória má, apagavas ou guardavas para aprender?",
      "Preferes ser respeitado pela tua inteligência ou amado pela tua bondade?",
      "O que é que a maioria das pessoas não entende sobre ti?"
    ];
  }

  try {
    // Generate a seed based on time to ensure variety
    const seed = Date.now().toString().slice(-4);
    
    const prompt = `
      Gera 7 perguntas psicológicas para avaliar compatibilidade na área de "${interest}".
      
      REGRAS CRÍTICAS:
      1. Linguagem: Simples, direta, PT-PT (Portugal) mas acessível a qualquer lusófono.
      2. Nível: Um jovem de 18 anos tem de entender sem esforço. Sem palavras "caras" ou académicas.
      3. Profundidade: Apesar de simples, a pergunta tem de tocar na ferida ou nos valores fundamentais (Big Five).
      4. Variedade: Sê criativo! Não uses as perguntas "padrão" de entrevistas. Inventa cenários ou dilemas.
      5. Seed de aleatoriedade: ${seed} (Usa isto para variar as perguntas).

      Exemplo do tom desejado: "Preferes ter razão ou ter paz?" em vez de "Qual a tua predisposição para conflitos cognitivos?"

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
        temperature: 1.2, // High temperature for variety
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
      "Nas discussões, tentas ganhar ou tentas entender o outro?",
      "O que é que a maioria das pessoas pensa de ti que está errado?",
      "Dás mais valor a alguém que é honesto (mas rude) ou simpático (mas falso)?",
      "Qual é o teu plano para quando as coisas correm mal?",
      "O que é que te faz perder o interesse em alguém imediatamente?",
      "Quando tens um problema, preferes resolver sozinho ou pedir ajuda?",
      "Se o dinheiro não existisse, como passarias os teus dias?"
    ];
  }
};

export const analyzeCompatibility = async (userAnswers: Record<string, string>, interest: InterestType): Promise<number> => {
   if (!apiKey) return Math.floor(Math.random() * 30) + 70; // Mock score if no API

   try {
     const prompt = `
       Analisa as seguintes respostas de um utilizador procurando por ${interest}:
       ${JSON.stringify(userAnswers)}
       
       Com base nestas respostas, quão compatível é esta pessoa com um perfil "saudável e equilibrado"?
       Dá uma pontuação de 0 a 100. Sê rigoroso.
       Retorna apenas o número inteiro.
     `;

     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
          responseSchema: { type: Type.INTEGER }
       }
     });

     const score = parseInt(response.text || "75");
     return isNaN(score) ? 75 : score;
   } catch (e) {
     return 85;
   }
};

// NEW: Generates deep psychological reasoning for matches
export const generateDeepMatchAnalysis = (interest: InterestType, matchName: string): string => {
  const analysisTemplates = {
    [InterestType.DATING]: [
      `A vossa compatibilidade no traço de 'Abertura à Experiência' é de 94%. Ambos demonstraram, através das respostas, um medo latente de estagnação. Conectei-vos porque ambos valorizam a "verdade dolorosa" acima de "mentiras confortáveis". **Desafio:** Perguntem um ao outro: "Qual é a verdade sobre ti que tens medo de dizer no primeiro encontro?"`,
      `Detetei um padrão de apego semelhante: ambos são independentes, mas procuram um 'porto seguro'. O match ocorreu porque as vossas respostas sobre gestão de conflito são idênticas — preferem resolver logicamente do que ir dormir chateados. **Provocação:** "Quando estás triste, queres espaço ou um abraço? E porquê?"`,
      `A vossa linguagem do amor primária parece ser 'Atos de Serviço', mas a vossa linguagem de conflito é oposta. Isto cria uma tensão dinâmica interessante. Vocês precisam de alguém que vos desafie intelectualmente. **Pergunta:** "Qual foi a última vez que mudaste de opinião sobre algo fundamental?"`
    ],
    [InterestType.NETWORKING]: [
      `Ambos pontuaram alto em 'Ambição', mas baixo em 'Conformidade'. Isto indica que ambos são disruptores nas vossas áreas. O match existe porque nenhum de vocês suporta "conversas de circunstância". **Directo ao assunto:** "Qual é o projeto que tens na gaveta porque tens medo que falhe?"`,
      `Identifiquei que ambos valorizam a autonomia acima do salário. Vocês procuram liberdade, não apenas sucesso. **Topic:** "O que é que sacrificarias na tua carreira hoje para ter mais liberdade amanhã?"`
    ],
    [InterestType.FRIENDSHIP]: [
      `Os vossos perfis psicológicos mostram uma necessidade de 'Profundidade' vs 'Superficialidade'. Ambos responderam que preferem ter 2 amigos reais a 20 conhecidos. **Gelo:** "Qual é a opinião impopular que tens e que normalmente afasta as pessoas?"`,
      `Vocês partilham o mesmo sentido de humor negro e uma visão cínica mas esperançosa da vida. **Pergunta:** "Qual foi o momento mais embaraçoso da tua vida que agora te faz rir?"`
    ],
    [InterestType.MENTORSHIP]: [
      `Conexão baseada em Valores: O mentor tem a experiência que o mentee procura, mas o mentee tem a audácia que o mentor sente falta. É uma troca simbiótica. **Ponto de partida:** "Qual é a lição que aprendeste da maneira mais difícil possível?"`
    ],
    [InterestType.ACTIVITY_PARTNER]: [
      `Alta energia detetada. Ambos usam o desporto/atividade como escape para ansiedade mental. O match não é sobre o desporto, é sobre a 'terapia' que ele proporciona. **Questão:** "O que é que estás a tentar esquecer quando estás a correr/treinar?"`
    ]
  };

  const templates = analysisTemplates[interest] || analysisTemplates[InterestType.DATING];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return randomTemplate;
};

export const detectLocationFromCoordinates = async (lat: number, lng: number): Promise<{ city: string, country: string } | null> => {
    // Function kept for backward compatibility but unused in new UI flow
    return null;
};