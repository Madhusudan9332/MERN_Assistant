import {
  initBrowser,
  closeBrowser,
  scrapData,
  initPage,
  closePage,
} from "../operation/ai";

const init = async () => {
  try {
    await initBrowser();
    await initPage();
  } catch (err) {
    throw err;
  }
};

const responce = async (prompt) => {
  try {
    await init();
    const data = await scrapData(prompt);
    return data;
  } catch (err) {
    throw err;
  }
};

const newPage = async () => {
  try {
    await initPage();
  } catch (err) {
    throw err;
  }
};

const close = async () => {
  try {
    await closePage();
    await closeBrowser();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  init,
  responce,
  newPage,
  close,
};