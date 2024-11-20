const { chromium } = require('playwright');
const fs = require('fs');
const xlsx = require('xlsx');

(async () => {
    // Launch browser using Chrome DevTools Protocol
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0]; // Reuse the existing context
    const page = await context.newPage();

    // Open LinkedIn and navigate to job search
    const jobSearchUrl = 'https://www.linkedin.com/jobs/search/?currentJobId=3966857556&distance=25&geoId=102478259&keywords=frontend%20developer&origin=JOBS_HOME_SEARCH_CARDS';
    await page.goto(jobSearchUrl);

    // Wait for job listings to be visible
    const jobListingClassName = 'jobs-search-results-list';
    await page.waitForSelector(`.${jobListingClassName}`);
    console.log("Found List");

    const scrollPositions = [30, 60, 100]; // Scroll percentages

    // Scroll through the job listings
    for (const percent of scrollPositions) {
        await page.evaluate(({ jobListingClassName, percent }) => {
            const element = document.querySelector(`.${jobListingClassName}`);
            if (element) {
                const scrollHeight = element.scrollHeight;
                const scrollPosition = (scrollHeight * percent) / 100;
                element.scrollTo(0, scrollPosition);
            }
        }, { jobListingClassName, percent });

        console.log(`Scrolled to ${percent}%`);
        await page.waitForTimeout(3000); // Wait for 3 seconds
    } 
    await page.waitForSelector('.scaffold-layout__list-container div[class*="job-card-container"]');
    const elements = await page.$$('.scaffold-layout__list-container div[class*="job-card-container"]');
    
    let jobCount = 0;
    
    const elementCount = await page.evaluate(() => {
        return document.querySelectorAll('[data-view-name*="job-card"]').length;
    });

    console.log(`Jumlah elemen yang ditemukan: ${elementCount}`);

    let jobs = [];

    // Loop through each job card and click it
    for (let i = 1; i < elementCount; i++) {
        // Click on the job card
        try {
            await page.click(`(//*[contains(@data-view-name,"job-card")])[${i}]`);
            console.log(`Clicked on element ${i}`);
             // Extract job information after clicking the job card
        let job = await page.evaluate(async () => {
            const getElementText = async (xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.textContent.trim() : '';
            };

            const getElementHref = async (xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.href : '';
            };
            const jobTitle = await getElementText('//*[contains(@class, "top-card__job-title")]//h1//a');
            const companyName = await getElementText ("//div[@class='job-details-jobs-unified-top-card__company-name']/a");
            const _companyUrl = await getElementHref("//div[@class='job-details-jobs-unified-top-card__company-name']/a");
            const companyUrl = _companyUrl.replace('/life', '');
            const location = await getElementText("//div[contains(@class, 'job-details-jobs-unified-top-card__primary-description-container')]/div/span[1]");
            const description = await getElementText("//div[contains(@class, 'jobs-description-content')]//div[contains(@class, 'mt4')]");

            
            return {
                jobTitle,
                companyName,
                companyUrl,
                location,
                description
            };
        });
        jobs.push(job);

        } catch (error) {
            console.log(`Failed to click on element ${i}, error: ${error.message}`);
            
            // Lanjutkan ke elemen berikutnya tanpa menghentikan loop
        }


        // Wait for the click action to complete
        // await page.waitForTimeout(1000); // Adjust the timeout as needed

       

    }

    const uniqueCompanyUrls = Array.from(
        new Set(
            jobs
                .map(job => job.companyUrl)
                .filter(url => url) // Filter untuk menghapus string kosong
        )
    );

    let companies = [];

    for (let companyUrl of uniqueCompanyUrls) {
        const linkedInURL = `${companyUrl}/about`;
        
        await page.goto(linkedInURL);
        await page.waitForTimeout(5000); // Wait for 5 seconds

        let company = await page.evaluate(async () => {
            const getElementText = async (xpath) => {
                const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return element ? element.textContent.trim() : '';
            };

            const name = await getElementText('//h1[contains(@class, "org-top-card-summary__title")]');
            const description = await getElementText("(//*[contains(@class, 'org-page-details')]//p)[1]");
            const website = await getElementText("(//*[contains(@class, 'org-page-details')]//span[contains(@class, 'link-without-visited-state')])");
            const industry = await getElementText("//dt[text()='Industry']/following-sibling::dd[1]");
            const employee = await getElementText("//dt[text()='Industry']/following-sibling::dd[2]");

            console.log(`berhasil ambil data ${name}`)

            return { name, description, website, industry , employee };
        });

        companies.push({ companyUrl, ...company });
    }

    // Save data to an Excel file
    const wb = xlsx.utils.book_new();
    
    // Create a sheet for job listings
    const jobSheet = xlsx.utils.json_to_sheet(jobs);
    xlsx.utils.book_append_sheet(wb, jobSheet, "Jobs");

    // Create a sheet for company details
    const companySheet = xlsx.utils.json_to_sheet(companies);
    xlsx.utils.book_append_sheet(wb, companySheet, "Companies");

    // Write the workbook to a file
    xlsx.writeFile(wb, 'jobs_and_companies.xlsx');

    console.log('Data saved to jobs_and_companies.xlsx');

    // Close browser
    await browser.close();
})();
