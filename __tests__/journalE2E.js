const puppeteer = require('puppeteer');

describe('Journal App E2E Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/journal/index.html'); // Replace with the actual URL of your app
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should create a new journal entry', async () => {
    await page.click('#addEntry');
    const entries = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#journalEntries .list-group-item')).map(entry => ({
        title: entry.querySelector('h3').textContent,
        content: entry.querySelector('p').textContent,
      }));
    });

    expect(entries.length).toBe(1);
    expect(entries[0].title).toBe(new Date().toLocaleString());
    expect(entries[0].content).toBe('Enter your text here...');
  });

  test('should update the title of the journal entry', async () => {
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
  });

  test('should update the content of the journal entry', async () => {
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
  });

  test('should delete the journal entry', async () => {
    await page.click('#journalEntries .list-group-item .delete');

    const entries = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#journalEntries .list-group-item')).map(entry => ({
        title: entry.querySelector('h3').textContent,
        content: entry.querySelector('p').textContent,
      }));
    });

    expect(entries.length).toBe(0);
  });
});
