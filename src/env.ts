import "dotenv/config";

export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION || "",
};
