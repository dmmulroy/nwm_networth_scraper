require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto('https://login.northwesternmutual.com/login');

    const emailInput = await page.$('#username');
    await emailInput.click();
    await page.type(process.env.NWM_USERNAME);

    const passwordInput = await page.$('#password');
    await passwordInput.click();
    await page.type(process.env.NWM_PASSWORD);

    const loginButton = await page.$('#login');
    await loginButton.click();

    await page.waitForNavigation();

    const twoFactorButton = await page.$(
      '#app > div > div > div.col.large-12.right-panel > div > div > div > div.col.small-24.custom-box.custom-box-offset > div'
    );
    await twoFactorButton.click();

    const securityQuestionInput = await page.$('#questionAnswer');
    await securityQuestionInput.click();
    page.type(process.env.NWM_SQ);

    const securityQuestionButton = await page.$('#name');
    await securityQuestionButton.click();

    await page.waitForNavigation();

    await page.waitForSelector(
      '#app-container > div.historical_balances.card > div > div > h1'
    );

    const networth = await page.$eval(
      '#app-container > div.historical_balances.card > div > div > h1',
      el => el.innerText
    );

    console.log('Your current networth is:', networth);
  } catch (err) {
    console.log('error:', err);
  }
})();
