import {
  FunctionDeclaration,
  FunctionDeclarationSchemaType,
} from "@google/generative-ai";
import { Page } from "puppeteer";
import {
  clickOnElement,
  goToUrl,
  inputText,
  saveToMemory,
} from "./browser_functions";

export const tools: (FunctionDeclaration & { handler: Function })[] = [
  {
    name: "save_to_memory",
    description:
      "Saves important information to memory for future use (either as part of the answer or to help you answer future queries).",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        information: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The text to save to memory.",
        },
      },
      required: ["information"],
    },
    handler: saveToMemory,
  },
  {
    name: "go_to_url",
    description: "Navigates to a specified URL and returns the page content.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        url: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The URL to navigate to.",
        },
      },
      required: ["url"],
    },
    handler: goToUrl,
  },
  {
    name: "click_on_element",
    description:
      "Clicks on a specified element on the page and returns the page content.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        selector: {
          type: FunctionDeclarationSchemaType.STRING,
          description:
            "Selector to click. CSS selectors can be passed as-is (only basic CSS selectors are supported) and a Puppeteer-specific selector syntax allows quering by text, a11y role and name, and xpath and combining these queries across shadow roots. Alternatively, you can specify the selector type using a prefix. e.g. 'div ::-p-text(Checkout)' will find the element inside a div element that has Checkout as the inner text.",
        },
      },
      required: ["selector"],
    },
    handler: clickOnElement,
  },
  {
    name: "input_text",
    description:
      "Inputs text into a specified element on the page and optionally hits Enter, then returns the page content.",
    parameters: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        selector: {
          type: FunctionDeclarationSchemaType.STRING,
          description:
            "Selector to input text into. CSS selectors can be passed as-is (only basic CSS selectors are supported) and a Puppeteer-specific selector syntax allows quering by text, a11y role and name, and xpath and combining these queries across shadow roots. Alternatively, you can specify the selector type using a prefix.  e.g. 'div ::-p-text(Checkout)' will find the element inside a div element that has Checkout as the inner text.",
        },
        text: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The text to input.",
        },
        hitEnter: {
          type: FunctionDeclarationSchemaType.BOOLEAN,
          description:
            "Whether to hit Enter after inputting the text. Defaults to False.",
        },
      },
      required: ["selector", "text"],
    },
    handler: inputText,
  },
];
