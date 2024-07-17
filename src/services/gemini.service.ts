import { env } from "../env";
import { FunctionDeclaration, FunctionDeclarationsTool, GoogleGenerativeAI, Tool } from "@google/generative-ai";
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
    tools
  }: GeminiAIServiceConfig): Promise<string | Record<string, any>> {
    const gemini = this.geminiClient.getGenerativeModel({
      model,
      systemInstruction,
      tools: [{ functionDeclarations: tools }]
    });

    const runGemini = async () => {
      const chat = gemini.startChat({
        history,
        generationConfig,
      });

      const result = await chat.sendMessage(userMessage);

      const responseGemini = result.response;

      const functionCalls = responseGemini.functionCalls();

      console.log("ANSWER", responseGemini.text());
      console.log("FUNCTION CALLS", functionCalls);

      return responseGemini.text();
    };

    // const wrappedGeminiCall = limiter.wrap(runGemini);

    const answer = await runGemini();

    return answer;
  }
}