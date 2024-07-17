import { FunctionDeclaration, FunctionDeclarationSchemaType } from "@google/generative-ai";

export const tools: FunctionDeclaration[] = [
    {
    "name": "go_to_url",
    "description": "Navigates to a specified URL and returns the page content.",
    "parameters": {
      "type": FunctionDeclarationSchemaType.OBJECT,
      "properties": {
        "url": {
          "type": FunctionDeclarationSchemaType.STRING,
          "description": "The URL to navigate to."
        }
      },
      "required": [ "url"]
    }
  },
  {
    "name": "click_on_element",
    "description": "Clicks on a specified element on the page and returns the page content.",
    "parameters": {
      "type": FunctionDeclarationSchemaType.OBJECT,
      "properties": {
        "selector": {
          "type": FunctionDeclarationSchemaType.STRING,
          "description": "The CSS selector of the element to click."
        }
      },
      "required": ["selector"]
    }
  },
  {
    "name": "input_text",
    "description": "Inputs text into a specified element on the page and optionally hits Enter, then returns the page content.",
    "parameters": {
      "type": FunctionDeclarationSchemaType.OBJECT,
      "properties": {
        "selector": {
          "type": FunctionDeclarationSchemaType.STRING,
          "description": "The CSS selector of the element to input text into."
        },
        "text": {
          "type": FunctionDeclarationSchemaType.STRING,
          "description": "The text to input."
        },
        "hitEnter": {
          "type": FunctionDeclarationSchemaType.BOOLEAN,
          "description": "Whether to hit Enter after inputting the text. Defaults to False.",
        }
      },
      "required": ["selector", "text"]
    }
  }
]