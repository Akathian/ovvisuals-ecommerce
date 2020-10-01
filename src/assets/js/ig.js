const { time } = require('console');
/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable func-names */
const fs = require('fs');
const { interval } = require('rxjs');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const puppeteer = require('puppeteer');

const options = new chrome.Options();
options.addArguments('--no-sandbox mode');
// options.addArguments('--headless');

class Scraper {
    constructor() {
        this.By = webdriver.By;
        this.until = webdriver.until;
        this.driver = new webdriver.Builder()
            .withCapabilities(options.toCapabilities())
            .build();
        this.url = 'https://www.instagram.com/';
        this.driver.get(this.url);
    }
}
class Starbucks extends Scraper {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    async clickButton(name) {
        try {
            return this.driver
                .wait(this.until.elementLocated(this.By.className(name)))
                .then(el => {
                    return el.click();
                });
        } catch (e) {
            console.log(e);
            return 1;
        }
    }


    async login() {
        await this.driver.get(
            'https://www.instagram.com/'
        );
        const fillForm = async (data, idName) => {
            try {
                const form = await this.driver.wait(
                    this.until.elementLocated(this.By.name(idName))
                );
                await form.sendKeys(data);
            } catch (e) {
                console.log(e);
            }
        };

        await fillForm(this.username, 'username');
        await fillForm(this.password, 'password');
        await this.clickButton('                    Igw0E     IwRSH      eGOV_         _4EzTm                                                                                                              ')
    }

    async goToDm() {
        await this.driver.wait(this.until.elementLocated(this.By.className('Fifk5')))
        await this.clickButton("sqdOP yWX7d    y3zKF     ");
        await this.driver.get('https://www.instagram.com/direct/inbox/')
        await this.clickButton("aOOlW   HoLwm ");
    }
}

async function scrape() {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false });
        const page = await browser.newPage();
        await page.goto('http://127.0.0.1:5500/test/a.html', { waitUntil: 'networkidle0' });
        page.waitForNavigation();

        await page.waitForSelector('input[name="choice"]');
        console.log("success 1")

        await page.click('input[name="choice"]');
        console.log("success 2")

        // await page.click('._5f5mN.jIbKX.KUBKM.yZn4P');
        console.log("success last")
        // await page.click('.tEIkn');
        // await page.click('._5f5mN.jIbKX.KUBKM.yZn4P');
        // setTimeout(async () => {
        //     let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        //     console.log(bodyHTML);
        // }, 30000);
    } catch (e) {
        console.log(e);
    }
}


async function scrape() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://instagram.com', { waitUntil: 'networkidle0' });
    // await page.waitForNavigation();

    await page.click('input[name=username]');
    await page.keyboard.type('akathian.s');
    console.log('Typed user');
    await page.click('input[name=password]');
    await page.keyboard.type('Sakakumar05()');
    console.log('Typed pass');
    await page.click('.DhRcB');
    console.log('Click login');

    // suspicious login attempt
    // await sus();
    console.log('normal');
    await page.waitForSelector('._2dbep.qNELH');
    await page.click('.sqdOP.L3NKy.y3zKF');
    await page.waitForSelector(".aOOlW.HoLwm")
    await page.click(".aOOlW.HoLwm")

    // setTimeout(async () => {
    //     let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    //     console.log(bodyHTML);
    // }, 30000);

    await page.goto('https://www.instagram.com/direct/inbox/', {
        waitUntil: 'networkidle0',
    });
    console.log('in dm');
    await page.waitForSelector('._2NzhO.EQ1Mr', { timeout: 60000 });
    await page.click('._2NzhO.EQ1Mr');
    await page.waitForSelector('input[name=queryBox]', { timeout: 60000 });
    await page.keyboard.type('athis.guitar');
    await page.waitForSelector('.dCJp8', { timeout: 60000 });
    await page.click('.dCJp8');
    console.log('got person');

    await page.waitForSelector('.sqdOP.yWX7d.y3zKF.cB_4K');
    await page.click('.sqdOP.yWX7d.y3zKF.cB_4K');
    await page.waitForSelector('.Igw0E.IwRSH.eGOV_.vwCYk.ItkAi');
    await page.click('.Igw0E.IwRSH.eGOV_.vwCYk.ItkAi');
    await page.keyboard.type('Hey');
    await page.keyboard.press(String.fromCharCode(13));
    console.log('done');
    await browser.close();
}
scrape()
module.exports = { scrape }
