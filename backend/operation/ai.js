const puppeteer = require("puppeteer");
const mode = process.env.NODE_ENV || 'development';

let browser;
let page;

const aiPrompt = async (prompt, page) => {
  await page.waitForSelector(".chatbox", { timeout: 10000 });
  const chatboxes = await page.$$(".chatbox");
  const lastChatbox = chatboxes[chatboxes.length - 1];

  if (lastChatbox) {
    await lastChatbox.click();
    await lastChatbox.type(prompt);
    await lastChatbox.press("Enter");
  } else {
    throw new Error("Chatbox not found.");
  }
};

const aiResponce = async (page) => {
  await page.waitForSelector(".outputBox", { timeout: 10000 });
  const outputBoxes = await page.$$(".outputBox");
  const lastOutputBox = outputBoxes[outputBoxes.length - 1];

  if (lastOutputBox) {
    const outputText = await page.evaluate((el) => el.innerText, lastOutputBox);
    return outputText;
  } else {
    throw new Error("Output box not found.");
  }
};

const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: 'C:\\Users\\hp\\.cache\\puppeteer\\chrome\\win64-131.0.6778.204\\chrome-win64\\chrome.exe', // Set the correct path
      headless: true,
      timeout: 120000,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return browser;
  } else {
    throw new Error("Browser already initialized.");
  }
};

const initPage = async () => {
  if (browser) {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto("https://deepai.org/chat", { timeout: 60000 });
    return page;
  } else {
    throw new Error("Browser not initialized. Call initBrowser first.");
  }
};

const closePage = async () => {
  if (page) await page.close();
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
};

const scrapData = async (prompt) => {
  try {
    if (page.url() !== "https://deepai.org/chat") {
      await page.goto("https://deepai.org/chat");
    }
    await aiPrompt(prompt, page);
    const data = await aiResponce(page);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  initBrowser,
  closeBrowser,
  scrapData,
  initPage,
  closePage,
};
