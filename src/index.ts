import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function run(query: string) {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log("Launched browser");
    
    // Navigate the page to a URL.
    await page.goto("https://google.com");

    console.log("Navigated to the Google page");

    // Find the input field with the title "Search" and fill it with the query
    await page
    .locator('textarea[title="Search"]')
    .fill(query);

    console.log("Filled the search box");

    // Click the button with the text "Google Search"
    await page.locator("text=Google Search").click();

    console.log("Clicked the Search button");

    // Wait for the search results to load
    await page.waitForSelector("h3");

    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));


    // Get the top 5 links with titles
    const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("h3")).map(h3 => {
        const parentAnchor = h3.closest('a');
        const title = h3.textContent;
        const href = parentAnchor ? (parentAnchor as HTMLAnchorElement).href : null;
        return href ? { title, href } : null;
        }).filter((link): link is { title: string | null, href: string } => link !== null).slice(0, 5);
    
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
  .help()
  .argv;