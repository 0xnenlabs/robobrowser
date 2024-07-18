import OpenAI, { type ClientOptions } from "openai";
import { env } from "../env";

const openaiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORGANIZATION,
  timeout: 20 * 1000,
} as ClientOptions);

export class OpenAIService {
  private openaiClient: OpenAI;

  constructor() {
    this.openaiClient = openaiClient;
  }

  async callOpenAI({
    messages,
    model = "gpt-4o",
    temperature = 0.1,
    tool_choice = "auto",
    maxTokens = 4096,
    tools,
  }: {
    messages: any[];
    model: string;
    tool_choice?: "auto" | "required";
    temperature?: number;
    maxTokens?: number;
    tools?: any[];
  }): Promise<{ response: string; functionCall: any }> {
    const response = await this.openaiClient.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      top_p: 1,
      max_tokens: maxTokens,
      frequency_penalty: 0,
      presence_penalty: 0,
      tools,
      tool_choice,
      parallel_tool_calls: false,
    });

    if (!response.choices?.[0]) {
      throw new Error("No response content");
    }

    const responseMessage = response.choices[0].message;
    let functionCall = null;
    const toolCalls = responseMessage.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const functionName = toolCalls[0].function.name;
      const functionArguments = JSON.parse(toolCalls[0].function.arguments);
      functionCall = {
        name: functionName,
        args: functionArguments,
      };
    }

    console.log(JSON.stringify(response.choices[0], null, 2));

    return {
      response: responseMessage.content || "",
      functionCall: functionCall,
    };
  }
}
