const puppeteer = require('puppeteer');

describe('Calendar end to end', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch(); // Viewing the browser for testing
        page = await browser.newPage();
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/calendar/index.html');
        //https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/calendar/index.html
        await page.setViewport({ width: 1920, height: 1080 });

    }, 15000);

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    }, 15000);

    test("Add task and check local Storage", async () => {
        
        let num = await page.evaluate(() => {
            let num = document.querySelector('#calendar > div:nth-child(10)').innerText;
            return num;
        });
        await page.click('#calendar > div:nth-child(10)');
        await page.click('#add-task-button');
        await page.type('#taskTitleModal', 'test1');
        let curr = new Date();
        let month = curr.getMonth();
        
        month = Number(month)+1;
        if (month < 10) {
            month = '0' + month;
            month = month.toString();
        } else {
            month = month.toString();
        }
        num = Number(num)+2;
        num = num.toString();
        if (num < 10) {
            num = '0' + num;
        }
        
        let year = curr.getFullYear();
        await page.type('#endDateModal', `${month}${num}${year}`);
        await page.click('#addTaskFormModal > button')
        let data = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        });
        let title = data[0].title;
        expect(title).toEqual('test1');
        
    }, 15000);

    test("Check start date", async () => {
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        
        let num = await page.evaluate(() => {
            let num = document.querySelector('#calendar > div:nth-child(10) > div.day-number').innerText;
            return num;
        });
        
        let data = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        });
        let start = data[0].startDate;
        let date = start.substring(0, 10);
        let short = start.substring(0, 8);
        if (Number(num) < 10) {
            num = '0' + num;
        }
        expect(date).toBe(`${short}${num}`);

    }, 15000);

    test("Check end date", async () => {
        
        
        let data = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        });
        let start = data[0].startDate;
        let end = data[0].endDate.substring(0, 10);
        let day = Number(start.substring(8, 10));
        day+=2;
        if (day < 10) {
            day = '0' + day;
        }
        day = day.toString();
        let curr = new Date();
        var short = curr.toISOString().slice(0,8);

        expect(end).toBe(`${short}${day}`);

    }, 15000);

    test("Edit task and check local storage", async () => {
        let num = await page.evaluate(() => {
            let num = document.querySelector('#calendar > div:nth-child(10) > div.day-number').innerText;
            return num;
        });
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        await page.click('#calendar > div:nth-child(10)');
        await page.click('#task-list > li > button.edit-task');
        await page.type('#taskTitleModal', 'Edited');
        await page.click('#addTaskFormModal > button');
        let data2 = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        });
        let newtitle = data2[0].title;
        expect(newtitle).toBe('test1Edited');
    }, 15000);

    test("Checking if task is displayed", async () => {
        
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        let text = await page.evaluate(() => {
            let text = document.querySelector('#calendar > div:nth-child(10) > div.task').innerText;
            return text;
        });   
        expect(text).toBe("test1Edited")  ;
    }, 15000);

    test("Add project task and check if displayed", async () => {
        
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/projects/index.html');
        
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        
        await page.goto('https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/calendar/index.html');

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        let data = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('projectsData'));
        });
        let task = await page.evaluate(() => {
            return document.getElementsByClassName('task')[2].innerHTML;
        }); 
        expect(task).toBe('DUE: Example Project - First Task, Example');
    });
}, 15000);