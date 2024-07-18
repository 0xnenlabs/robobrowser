import { env } from "../env";
import { FunctionDeclaration } from "@google/generative-ai";

export type AnthropicAIServiceConfig = {
  model: string;
  maxTokens: number;
  tools: Record<string, any>[];
  messages: { role: "user" | "assistant"; content: string }[];
};

export class AnthropicService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = env.ANTHROPIC_API_KEY;
    this.apiUrl = "https://api.anthropic.com/v1/messages";
  }

  async callAnthropic({
    model,
    maxTokens,
    tools,
    messages,
  }: AnthropicAIServiceConfig): Promise<{
    response: string;
    functionCall: {
      name: string;
      args: Record<string, any>;
    } | null;
  }> {
    console.log("calling anthropic");
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        tools,
        messages,
      }),
    });

    if (!response.ok) {
      console.log(`ErrorMessage: ${JSON.stringify(await response.json())}`);
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    const responseContent = responseData.content;

    let functionCall = null;
    for (const item of responseContent) {
      if (item.type === "tool_use") {
        functionCall = {
          name: item.name,
          args: item.input,
        };
        break;
      }
    }

    return {
      response: responseContent
        .map((item: { text: string }) => item.text || "")
        .join(" "),
      functionCall,
    };
  }
}
