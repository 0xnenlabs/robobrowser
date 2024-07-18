import { Page } from "puppeteer";

export async function goToUrl({
  page,
  url,
}: {
  page: Page;
  url: string;
}): Promise<{ newPage: Page; content: string }> {
  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const content = await page.content();
  return { newPage: page, content };
}

export async function clickOnElement({
  page,
  selector,
}: {
  page: Page;
  selector: string;
}): Promise<{ newPage: Page; content: string }> {
  console.log(`Found on ${selector}`);
  await page.locator(selector).click();
  console.log(`Clicked on ${selector}`);
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  const content = await page.content();
  //await page.close();
  return { newPage: page, content };
}

export async function inputText({
  page,
  selector,
  text,
  hitEnter = false,
}: {
  page: Page;
  selector: string;
  text: string;
  hitEnter?: boolean;
}): Promise<{ newPage: Page; content: string }> {
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  if (element) {
    await element.focus();
    await element.type(text);
    if (hitEnter) {
      await element.press("Enter");
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    }
  }
  const content = await page.content();
  //await page.close();
  return { newPage: page, content };
}

export const saveToMemory = async ({
  page,
  information,
}: {
  page: Page;
  information: string;
}) => {
  console.log(`Saving ${information} to memory`);
  return { newPage: page, content: "" };
};
