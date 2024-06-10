const puppeteer = require('puppeteer');

describe('Journal App E2E Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch(); // Set to false if you want to see the browser actions
        page = await browser.newPage();
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/journal/index.html'); // Replace with the actual URL of your app
        await page.setViewport({ width: 1080, height: 2048 });
    }, 25000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    test('should create a new journal entry and check if it is in local storage', async () => {
        await page.click('#addEntry'); // Click the Add Entry button

        const entries = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#journalEntries .list-group-item')).map(entry => ({
                title: entry.querySelector('h3').textContent,
                content: entry.querySelector('p').textContent,
            }));
        });

        const newEntryTitle = new Date().toLocaleString();
        expect(entries.length).toBe(1);
        expect(entries[0].title).toBe(newEntryTitle);
        expect(entries[0].content).toBe('Enter your text here...');

        // Verify that the entry is saved to local storage
        const storedEntries = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journalEntries'));
        });

        expect(storedEntries.length).toBe(1);
        expect(storedEntries[0].title).toBe(newEntryTitle);
        expect(storedEntries[0].content).toBe('Enter your text here...');
    });

    test('should update the title of the journal entry and check local storage', async () => {
        const newTitle = 'Updated Title';
        await page.evaluate((newTitle) => {
            const titleElement = document.querySelector('#journalEntries .list-group-item h3');
            titleElement.textContent = newTitle;
            titleElement.dispatchEvent(new Event('blur'));
        }, newTitle);

        const updatedTitle = await page.evaluate(() => {
            return document.querySelector('#journalEntries .list-group-item h3').textContent;
        });

        expect(updatedTitle).toBe(newTitle);

        // Verify that the title update is saved to local storage
        const storedEntries = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journalEntries'));
        });

        expect(storedEntries[0].title).toBe(newTitle);
    });

    test('should update the content of the journal entry and check local storage', async () => {
        const newContent = 'Updated Content';
        await page.evaluate((newContent) => {
            const contentElement = document.querySelector('#journalEntries .list-group-item p');
            contentElement.textContent = newContent;
            contentElement.dispatchEvent(new Event('blur'));
        }, newContent);

        const updatedContent = await page.evaluate(() => {
            return document.querySelector('#journalEntries .list-group-item p').textContent;
        });

        expect(updatedContent).toBe(newContent);

        // Verify that the content update is saved to local storage
        const storedEntries = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journalEntries'));
        });

        expect(storedEntries[0].content).toBe(newContent);
    });

    test('should delete the journal entry and check local storage', async () => {
        await page.click('#journalEntries .list-group-item .delete');

        const entries = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#journalEntries .list-group-item')).map(entry => ({
                title: entry.querySelector('h3').textContent,
                content: entry.querySelector('p').textContent,
            }));
        });

        expect(entries.length).toBe(0);

        // Verify that the deletion is saved to local storage
        const storedEntries = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journalEntries'));
        });

        expect(storedEntries.length).toBe(0);
    });
});
