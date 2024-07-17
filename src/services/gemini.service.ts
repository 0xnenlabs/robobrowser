import { env } from "../env";
import { FunctionDeclaration, GoogleGenerativeAI } from "@google/generative-ai";
// import Bottleneck from "bottleneck";

const geminiClient = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// const limiter = new Bottleneck({
//   minTime: 30000,
// });

export type GeminiAIServiceConfig = {
  systemInstruction: string;
  userMessage: string;
  history: { role: "user" | "model"; parts: { text: string }[] }[];
  model: string;
  generationConfig: {
    temperature: number;
  };
  tools: FunctionDeclaration[];
};

export class GeminiAIService {
  private geminiClient: GoogleGenerativeAI;

  constructor() {
    this.geminiClient = geminiClient;
  }

  async callGemini({
    systemInstruction,
    userMessage,
    history,
    model,
    generationConfig,
    tools,
  }: GeminiAIServiceConfig): Promise<{
    response: string;
    functionCall: {
      name: string;
      args: Record<string, any>;
    } | null;
  }> {
    const gemini = this.geminiClient.getGenerativeModel({
      model,
      systemInstruction,
      tools: [{ functionDeclarations: tools }],
    });

    const runGemini = async () => {
      const chat = gemini.startChat({
        history,
        generationConfig,
      });

      const result = await chat.sendMessage(userMessage);

      const responseGemini = result.response;

      const responseText = responseGemini.text();
      const functionCalls = responseGemini.functionCalls();
      const functionCall =
        functionCalls && functionCalls.length > 0 ? functionCalls[0] : null;

      console.log("TEXT RESPONSE", responseText);
      console.log("FUNCTION CALLS", functionCall);

      return {
        response: responseText,
        functionCall: functionCall,
      };
    };

    // const wrappedGeminiCall = limiter.wrap(runGemini);

    const answer = await runGemini();

    return answer;
  }
}
