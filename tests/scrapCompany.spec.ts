const { chromium } = require('playwright');

(async () => {
  // Launch browser using Chrome DevTools Protocol
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0]; // Reuse the existing context
  const page = await context.newPage();

  // Go to the Amazon LinkedIn page
  await page.goto('https://www.linkedin.com/company/amazon/');

  // Uncomment the next line to ensure the page has finished loading
  // await page.waitForLoadState('networkidle');
  await page.waitForSelector(`(//a[@href="/company/amazon/about/"])[1]`);

  await page.click(`(//a[@href="/company/amazon/about/"])[1]`);
  await page.waitForTimeout(5000); // Menunggu selama 5 detik

  let companyData = [];
  let company = await page.evaluate(async () => {
    const getElementText = async (xpath) => {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return element ? element.textContent.trim() : '';
    };

    const nameResult = await getElementText('//h1[contains(@class, "org-top-card-summary__title")]');
    const description = await getElementText("(//*[contains(@class, 'org-page-details')]//p)[1]");
    const linkCompany = await getElementText("(//*[contains(@class, 'org-page-details')]//span[contains(@class, 'link-without-visited-state')])");

    const companyDatas = await getElementText("(//*[contains(@class, 'org-page-details')])");






    return {
      name: nameResult,
      about: description,
      link: linkCompany,
      all: companyDatas
    };
  });

  companyData.push(company);

  console.log('Amazon Company Information:');
  console.log(companyData);

  // Close browser
  await browser.close();
})();
