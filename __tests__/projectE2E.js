const puppeteer = require('puppeteer');

describe('Project Management Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false, slowMo: 10 }); // Viewing the browser for testing
        page = await browser.newPage();
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/projects/index.html');
    }, 15000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    test('Add new project and check if in local storage', async () => {
        await page.click('#add-project-button'); // Click the Add Project button

        // Populate the project details
        await page.type('#project-title', 'Puppeteer Test Project');
        await page.type('#project-description', 'test description');

        await page.evaluate(() => {
            const input = document.getElementById('project-image');
            input.setAttribute('type', 'text');
            input.value = 'https://avatars.githubusercontent.com/u/47124258?v=4';
            input.setAttribute('type', 'file');
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
    }, 30000);

    test('Edit a project, check char limit, and check if in local storage', async () => {
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
    }, 30000);

});