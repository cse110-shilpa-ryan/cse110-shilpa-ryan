const puppeteer = require('puppeteer');

describe('Project Management Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch(); // Viewing the browser for testing
        page = await browser.newPage();
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/projects/index.html');
        //await page.goto('http://127.0.0.1:5502/assets/src/projects/index.html');
        await page.setViewport({ width: 1080, height: 1024 });

    }, 15000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    /**
     tests to write :
        add project
        edit project
        add task
        edit task
        delete task
        delete project
        reload page & check
        return project to original   
     */

    test('Add new project and check if in local storage', async () => {
        await page.click('#add-project-button'); // Click the Add Project button

        // Populate the project details
        await page.type('#project-title', 'Puppeteer Test Project');
        await page.type('#project-description', 'test description');

        await page.evaluate(() => {
            const input = document.getElementById('project-image');

            input.setAttribute('file', 'https://avatars.githubusercontent.com/u/47124258?v=4');
        });

        // Save the project
        await page.click('#save-project-button'); // Make sure the button id is correct

        // Verify that the project is saved to local storage
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });

        expect(projectsData).toEqual([
            {
                "title": "Example Project",
                "description": "This is a description for the first project",
                "image": "../../images/mock.png",
                "tasks": [
                    {
                        "title": "First Task, Example",
                        "due": "2024-06-10"
                    }
                ]
            },
            {
                title: 'Puppeteer Test Proje',
                description: 'test description',
                image: '',
                tasks: []
            }
        ]);
    }, 3000);

    test('edit project, check char limit, and check local storage', async () => {
        // Click the Edit Project button for the first project
        await page.click('#edit-project-button');
        // Update the project details
        await page.$eval('#project-title', (el) => el.value = '');
        await page.type('#project-title', 'Project Updated');
        await page.$eval('#project-description', (el) => el.value = '');
        await page.type('#project-description', 'Updated description');

        // Save the project
        await page.click('#save-project-button'); // Make sure the button id is correct

        // Verify that the project is saved to local storage
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });

        expect(projectsData).toEqual([{
            title: 'Project Updated',
            description: 'Updated description',
            image: '../../images/mock.png',
            tasks: [
                {
                    title: 'First Task, Example',
                    due: '2024-06-10'
                }
            ]
        }, {
            title: 'Puppeteer Test Proje',
            description: 'test description',
            image: '',
            tasks: []
        }]);
    }, 3000);

    test('add task and check local storage', async () => {

        /// Navigate through the DOM as specified
        await page.waitForSelector('.project-container'); // Ensure the container is loaded
        // Find the first .project-column in the .project-container
        const projectContainer = await page.$('.project-container');
        const columns = await projectContainer.$$('.project-column');
        const firstColumn = columns[0];

        await page.click('#add-task-button'); // Click on the Add Task button

        // Click on the first .task-card within the project-column
        const today = new Date();
        const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Set to the next day using local time
        const tommorow = nextDay.toISOString().split('T')[0];

        await page.click('body'); // Click outside the task to save it

        // Check local storage for updated task list
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });
        expect(projectsData).toEqual([{
            title: 'Project Updated',
            description: 'Updated description',
            image: '../../images/mock.png',
            tasks: [
                {
                    title: 'First Task, Example',
                    due: '2024-06-10'
                }, {
                    title: 'New Task',
                    due: `${tommorow}`
                }
            ]
        }, {
            title: 'Puppeteer Test Proje',
            description: 'test description',
            image: '',
            tasks: []
        }]);
    }, 3000);

    test('add task, edit content, and check local storage', async () => {

        /// Navigate through the DOM as specified
        await page.waitForSelector('.project-container'); // Ensure the container is loaded
        // Find the first .project-column in the .project-container
        const projectContainer = await page.$('.project-container');
        const columns = await projectContainer.$$('.project-column');
        const firstColumn = columns[0];

        //await page.click('#add-task-button'); // Click on the Add Task button

        // Click on the first .task-card within the project-column
        const taskCards = await firstColumn.$$('.task-card');
        const lastTaskCard = taskCards[1];

        const taskNameInput = await lastTaskCard.$('#task-name');
        const taskDueInput = await lastTaskCard.$('#task-due');

        await taskNameInput.click({ clickCount: 3 });
        await taskNameInput.type('Updated Last Task');
        taskDueInput.click({ clickCount: 3 });
        await taskDueInput.type('07-11-2024');

        await page.click('body'); // Click outside the task to save it

        // Check local storage for updated task list
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });
        expect(projectsData).toEqual([{
            title: 'Project Updated',
            description: 'Updated description',
            image: '../../images/mock.png',
            tasks: [
                {
                    title: 'First Task, Example',
                    due: '2024-06-10'
                }, {
                    title: 'Updated Last Task',
                    due: '2024-07-11'
                }
            ]
        }, {
            title: 'Puppeteer Test Proje',
            description: 'test description',
            image: '',
            tasks: []
        }]);
    }, 3000);

});
