describe('Markdown Previewer Testing', () => {
    beforeAll(async () => {
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/md-previewer/index.html');
    });

    /**
     Tests to write :
        Initial page layout
        Navigation button is styled properly
        Adding text reflects into terminal
        Adding different styles reflects into terminal
        Line number is being updated
        Scrolling is consistent on the gutter/editor end 
     */
    it('Initial Page - Check if there is anything stored in localStorage\'s content key', async () => {
        console.log('Checking for nothing yet in localStorage');

        // Verify that there is nothing yet stored in localStorage at the 'content' key
        const markdownData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('content'));
        });

        expect(markdownData).toEqual();
    });

    it('Navigation Button Styling - Check that proper style is given to button', async () => {
        console.log('Checking Markdown Previewer Button is only navigation button bolded and underlined');

        await page.waitForSelector('#markdown-nav');
        // Verify that the project is saved to local storage
        const style = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });

        expect(projectsData).toEqual();
    });

    test('add task and check local storage', async () => {

        /// Navigate through the DOM as specified
        await page.waitForSelector('.project-container'); // Ensure the container is loaded
        // Find the first .project-column in the .project-container
        const projectContainer = await page.$('.project-container');
        const columns = await projectContainer.$$('.project-column');

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

    test('edit task content, and check local storage', async () => {

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

        await taskDueInput.click();
        await lastTaskCard.$eval('#task-due', (el) => el.value = '');
        await taskDueInput.type('07112024');

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

    test('delete task, and check local storage', async () => {

        /// Navigate through the DOM as specified
        await page.waitForSelector('.project-container'); // Ensure the container is loaded
        // Find the first .project-column in the .project-container
        const projectContainer = await page.$('.project-container');
        const columns = await projectContainer.$$('.project-column');
        const firstColumn = columns[0];

        // Click on the first .task-card within the project-column
        const taskCards = await firstColumn.$$('.task-card');
        const lastTaskCard = taskCards[1];

        await page.click('body'); // Click outside the task to save it

        // Check local storage for updated task list
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('storage'));
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

    test('delete project, and check local storage', async () => {
        // Click the Delete Project button for the first project
        await page.waitForSelector('.project-container'); // Ensure the container is loaded
        // Find the first .project-column in the .project-container
        const projectContainer = await page.$('.project-container');
        const columns = await projectContainer.$$('.project-column');
        // get first project card
        const firstColumn = columns[0];
        const projectCard = await firstColumn.$('.project-card');
        await projectCard.hover();

        // Click the Delete Project button
        const projectDeleteButton = await projectCard.$('.project-delete');
        await projectDeleteButton.click();

        // Check local storage for updated project list
        const projectsData = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });
        expect(projectsData).toEqual([{
            title: 'Puppeteer Test Proje',
            description: 'test description',
            image: '',
            tasks: []
        }]);
    }, 3000);

});
