const puppeteer = require('puppeteer');
const { describe } = require('yargs');

const host = "localhost";
const port = 8080;
const baseUrl = `http://${host}:${port}`;

jest.setTimeout(10000);

let browser, page;

beforeAll(async () => {
    console.log('initializing up puppeteer...');
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 5
    });
    page = await browser.newPage();
    await page.goto(baseUrl);
});

afterAll(async () => {
    console.log('closing up puppeteer...');
    if (browser) {
        await browser.close();
    }
});

test('user should be able to immediately see newly added todo', async () => {
    const fakeTodoDescription = 'Walk the dog';
    await page.focus('#todoInput');
    await page.type('#todoInput', fakeTodoDescription);
    await page.click('#btnAddTodo');
    const result = await page.$eval('div#todoList>ul', (ul) => ul.innerText);
    expect(result).toEqual(expect.stringContaining(fakeTodoDescription));
});

let takeScreenshot = async () => page && await page.screenshot({ path: 'screenshot.png' });