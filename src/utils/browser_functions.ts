import puppeteer, { Browser, Page } from "puppeteer";

export async function go_to_url(page: Page, url: string): Promise<[Page, string]> {
    console.log(`Navigating to ${url}`);
    //const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const content = await page.content();
    //await page.close();
    return [page, content];
}

export async function click_on_element(page: Page, selector: string): Promise<[Page, string]> {
    //const page = await browser.newPage();
    await page.waitForSelector(selector);
    await page.click(selector);
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const content = await page.content();
    //await page.close();
    return [page, content];
}

export async function input_text(page: Page, selector: string, text: string, hitEnter: boolean = false): Promise<[Page, string]> {
    //const page = await browser.newPage();
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    if (element) {
        await element.focus();
        await element.type(text);
        if (hitEnter) {
            await element.press('Enter');
        }
    }
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const content = await page.content();
    //await page.close();
    return [page, content];
}