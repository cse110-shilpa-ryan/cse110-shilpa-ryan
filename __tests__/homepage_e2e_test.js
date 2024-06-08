const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

describe('Homepage E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  afterAll(async () => {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before closing the browser
    await browser.close();
  });

  it('should load the homepage and check main elements', async () => {
    await page.goto('http://127.0.0.1:5502/assets/src/front-page/index.html'); 

    // Wait for the main elements to load
    await page.waitForSelector('header');
    await page.waitForSelector('main');
    await page.waitForSelector('.title-date');
    await page.waitForSelector('.project-container');
    await page.waitForSelector('.task-container');
    await page.waitForSelector('.journal-container');

    const header = await page.$('header');
    const main = await page.$('main');
    const titleDate = await page.$('.title-date');
    const projectContainer = await page.$('.project-container');
    const taskContainer = await page.$('.task-container');
    const journalContainer = await page.$('.journal-container');

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(titleDate).toBeTruthy();
    expect(projectContainer).toBeTruthy();
    expect(taskContainer).toBeTruthy();
    expect(journalContainer).toBeTruthy();
  });

  it('should update the title date dynamically', async () => {
    await page.goto('http://127.0.0.1:5502/assets/src/front-page/index.html');
    
    // Wait for the title-date to be populated
    await page.waitForSelector('.title-date');

    const titleDate = await page.$eval('.title-date', el => el.textContent);

    const now = new Date();
    const expectedDate = `Home - ${now.toDateString()}`;
    
    expect(titleDate).toBe(expectedDate);
  });

  it('should render exactly 3 projects', async () => {
    await page.goto('http://127.0.0.1:5502/assets/src/projects/index.html');
    await page.goto('http://127.0.0.1:5502/assets/src/front-page/index.html');
  
    // Wait for the projects to be rendered
    await page.waitForSelector('.project-card');
  
    // Get the number of rendered projects
    const renderedProjectsCount = await page.$$eval('.project-card', cards => cards.length);
  
    // Ensure that the number of rendered projects is exactly 3
    expect(renderedProjectsCount).toBe(3);
  },5000);
  
  
  it('should render the top 3 projects', async () => {
    const projectsPath = path.resolve(__dirname, '../assets/src/projects/projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    const topProjects = projects.slice(0, 3);

    await page.goto('http://127.0.0.1:5502/assets/src/front-page/index.html');

    // Wait for the projects to be rendered
    await page.waitForSelector('.project-card');

    const renderedProjects = await page.$$eval('.project-card', cards => {
      return cards.slice(0, 3).map(card => {
        const title = card.querySelector('.project-details h3').textContent;
        const description = card.querySelector('.project-details p').textContent;
        const imageSrc = card.querySelector('.project-image').style.backgroundImage.slice(4, -1).replace(/"/g, '');
        return { title, description, imageSrc };
        // return { title, description };
      });
    });

    // Compare each rendered project with the corresponding project from JSON
    renderedProjects.forEach((renderedProject, index) => {
      const expectedProject = topProjects[index];
      expect(renderedProject.title).toBe(expectedProject.title);
      expect(renderedProject.description).toBe(expectedProject.description);
      expect(renderedProject.imageSrc).toBe(expectedProject.image);
    });
  },5000);

  // TODO: task tests
  

});

