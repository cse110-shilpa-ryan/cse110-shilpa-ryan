const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

describe('Homepage E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    // await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before closing the browser
    await browser.close();
  });

  test('should load the homepage and check main elements', async () => {
    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/front-page/index.html'); 

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
  }, 15000);

  test('should update the title date dynamically', async () => {
    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/front-page/index.html');
    
    // Wait for the title-date to be populated
    await page.waitForSelector('.title-date');

    const titleDate = await page.$eval('.title-date', el => el.textContent);

    const now = new Date();
    const expectedDate = `Home - ${now.toDateString()}`;
    
    expect(titleDate).toBe(expectedDate);
  }, 15000);

  test('should render top 3 projects, or all if less than 3 projects in total', async () => {
    // Laod the project page first
    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/projects/index.html');
  
    // Navigate to the front page
    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/front-page/index.html');
  
    await page.waitForSelector('.project-card');

    const renderedProjects = await page.$$('.project-card');

    // Read the number of projects from local storage
    const totalProjectCount = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('projectsData')).length;
    });
  
    if (totalProjectCount.length >= 3) {
        // If 3 or more projects are rendered, assert that exactly 3 are rendered
        expect(renderedProjects.length).toBe(3);
    } else {
        expect (renderedProjects.length).toBe(totalProjectCount);
    }
}, 15000);

  test('should render the top 3 projects', async () => {
    const projectsPath = path.resolve(__dirname, '../assets/src/projects/projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    const topProjects = projects.slice(0, 3);

    await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/front-page/index.html');

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
  }, 15000);

  test('should display only tasks that are due within the next 3 days', async () => {
    const upcomingTasksSelector = '#upcoming-tasks'; // Selector for the upcoming tasks container

    // Wait for the selector to appear in the DOM with a timeout of 10 seconds
    await page.waitForSelector(upcomingTasksSelector, { timeout: 1000 });

    // Extract the text content of all `li` elements within the `#upcoming-tasks` container
    const tasks = await page.$$eval(`${upcomingTasksSelector} li`, tasks => tasks.map(task => task.textContent));

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date without time
    const nextThreeDays = new Date(today);
    nextThreeDays.setDate(today.getDate() + 3); // Get the date 3 days from today

    tasks.forEach(taskText => {
      const dateMatch = taskText.match(/\(Due: (.+)\)/); // Extract the due date from the task text
      if (dateMatch) {
        const taskDate = new Date(dateMatch[1]); // Parse the due date
        taskDate.setHours(0, 0, 0, 0); // Ensure the task date is without time

        // Check if the task date is within the next 3 days
        if (taskDate.getTime() < today.getTime() || taskDate.getTime() > nextThreeDays.getTime()) {
          throw new Error(`Task "${taskText}" has a due date out of the expected range: ${dateMatch[1]}`);
        }
      } else {
        throw new Error(`Task text "${taskText}" does not contain a valid due date`);
      }
    });
  }, 15000); 


  test('should display all tasks due within the next 3 days', async () => {
    // Fetch tasks from local storage
    const upcomingTasksFromLocalStorage = JSON.parse(await page.evaluate(() => localStorage.getItem('tasks'))) || [];
    const projectTasksFromLocalStorage = JSON.parse(await page.evaluate(() => localStorage.getItem('projectsData'))) || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date without time
    const nextThreeDays = new Date(today);
    nextThreeDays.setDate(today.getDate() + 3); // Get the date 3 days from today

    // Filter and merge upcoming and project tasks due in 3 days
    const allTasksDueInThreeDays = [...upcomingTasksFromLocalStorage, ...projectTasksFromLocalStorage]
      .filter(task => {
        const taskDate = new Date(task.endDate);
        taskDate.setHours(0, 0, 0, 0); // Ensure the task date is without time
        return taskDate >= today && taskDate <= nextThreeDays;
      });

    const upcomingTasksSelector = '#upcoming-tasks'; // Selector for the upcoming tasks container

    // Wait for the selector to appear in the DOM with a timeout of 10 seconds
    await page.waitForSelector(upcomingTasksSelector, { timeout: 1000 });

    // Extract the text content of all `li` elements within the `#upcoming-tasks` container
    const tasksDisplayedOnPage = await page.$$eval(`${upcomingTasksSelector} li`, tasks => tasks.map(task => task.textContent));

    // Check if all tasks due in 3 days are displayed on the page
    allTasksDueInThreeDays.forEach(task => {
      const taskText = `${task.title || task.task} (Due: ${new Date(task.endDate).toDateString()})`;
      if (!tasksDisplayedOnPage.includes(taskText)) {
        throw new Error(`Task "${taskText}" due in 3 days is not displayed on the page`);
      }
    });
  }, 15000); 

  test('should assign each journal progress bar with a status class', async () => {
    const progressBarSelector = '#progress-bar';
    await page.waitForSelector(progressBarSelector, { timeout: 15000 });  
    const dailyBars = await page.$$eval(`${progressBarSelector} div`, bars => bars.map(b => b.className));
    
    dailyBars.forEach(barClass => {
      if (barClass === '') {
        throw new Error(`Progress bar classes not set`);
      }
      else if (barClass !== 'absent' && barClass !== 'present') {
        throw new Error(`Invalid class for progress bar - ${barClass}`);
      }
    });

  }, 15000); 

  test('should have seven days in the progress bar, and each day should be different', async () => {
    const progressBarSelector = '#progress-bar';
    await page.waitForSelector(progressBarSelector, { timeout: 15000 });  
    const dailyBars = await page.$$eval(`${progressBarSelector} div`, bars => bars.map(b => b.textContent));
    if (dailyBars.length !== 7) {
      throw new Error(`Invalid number of days in progress bar - was ${dailyBars.length}, should be 7`);
    }
    let checkDuplicates = new Set(dailyBars);
    if (checkDuplicates.size !== dailyBars.length) {
      throw new Error(`Duplicate day of the week values in progress bar, only ${checkDuplicates.length} unique values found`);
    }
  }, 15000);

  test('should only display journals within the last week', async () => {
    const journalSelector = '#home-journals';
    // Wait for the selector to appear in the DOM with a timeout of 10 seconds
    await page.waitForSelector(journalSelector, { timeout: 15000 });

    const journals = await page.$$eval(`${journalSelector} li`, journals => journals.map(j => j.textContent));

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date without time
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6); // Get the dates from last week

    journals.forEach(journalText => {
      let paranthesesRegEx =  /\(([^)]+)\)/;
      const dateMatch = journalText.match(paranthesesRegEx); // Extract the date from the journal
      if (dateMatch) {
        const journalDate = new Date(dateMatch[1]); // Parse the date
        taskDate.setHours(0, 0, 0, 0);

        if (journalDate.getTime() > today.getTime() || journalDate.getTime() < lastWeek.getTime()) {
          throw new Error(`Journal "${journalText}" has a date out of the expected range: ${dateMatch[1]}`);
        }
      } else {
        if(!(journalText === 'No recent journals'))
          throw new Error(`Task text "${journalText}" does not contain a valid due date`);
      }
    });
  }, 15000); 
});

