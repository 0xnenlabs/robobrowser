import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { cleanHtml } from "./utils/html";
import {
  go_to_url,
  click_on_element,
  input_text,
} from "./utils/browser_functions";
import { GeminiAIService } from "./services/gemini.service";
import { tools } from "./utils/browser_tools";
import { FunctionDeclaration, Tool } from "@google/generative-ai";

async function run(query: string) {
  const gemini = new GeminiAIService();

  // check if first call
  // if first call, then pass in go to url tool and user query as user message
  const firstCall = await gemini.callGemini({
    systemInstruction:
      "You are a helpful assistant that can answer questions and help with tasks. You have access to the internet and can use the internet to answer questions.",
    userMessage: query,
    history: [],
    model: "gemini-1.5-pro-latest",
    generationConfig: {
      temperature: 0.1,
    },
    tools: tools.filter((tool) => tool.name === "go_to_url") as FunctionDeclaration[],
  });

  console.log(firstCall);

  // wait for response
  // if response was a function call then
  // start loop,then call function, return cleaned html, and call model again with all the tools and the context
  // loop this step
  // if response is not function call, then print response and exit loop
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  console.log("Launched browser");

  // Navigate to Google
  [page] = await go_to_url(page, "https://google.com");
  console.log("Navigated to the Google page");

  // Fill the search box with the query
  [page] = await input_text(page, 'textarea[title="Search"]', query);
  console.log("Filled the search box");

  // Click the "Google Search" button
  [page] = await click_on_element(page, "text=Google Search");
  console.log("Clicked the Search button");

  const cleanedHtml = cleanHtml(await page.content());
  console.log(cleanedHtml);

  // Wait for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Get the top 5 links with titles
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("h3"))
      .map((h3) => {
        const parentAnchor = h3.closest("a");
        const title = h3.textContent;
        const href = parentAnchor
          ? (parentAnchor as HTMLAnchorElement).href
          : null;
        return href ? { title, href } : null;
      })
      .filter(
        (link): link is { title: string | null; href: string } => link !== null
      )
      .slice(0, 5);

    return anchors;
  });

  // Print the top 5 links with titles
  links.forEach((link, index) => {
    console.log(`${index + 1}: ${link.title} - ${link.href}`);
  });

  await browser.close();
}

// Set up yargs to accept a query parameter
yargs(hideBin(process.argv))
  .command(
    "search [query]",
    "Search Google for the given query",
    (yargs) => {
      yargs.positional("query", {
        describe: "The search query",
        type: "string",
      });
    },
    (argv) => {
      if (argv.query) {
        run(argv.query as string).catch(console.error);
      } else {
        console.error("Please provide a search query");
      }
    }
  )
  .demandCommand(1, "You need to specify a command before moving on")
  .help().argv;
