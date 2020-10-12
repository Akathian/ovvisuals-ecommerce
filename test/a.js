const puppeteer = require('puppeteer');

async function sus(page, code) {
    try {
        console.log('trying sus');
        await page.waitForSelector('input[name="choice"]');
        console.log('Click 1');
        await page.click('._5f5mN.jIbKX.KUBKM.yZn4P');
        console.log('Click 2');
        await page.waitForSelector('input[name="security_code"]');
        console.log('Click 3');
        await page.click('input[name="security_code"]');
        console.log('Click 4');
        await page.keyboard.type(code);
        console.log('Click 5');
        await page.waitForSelector('._5f5mN');
        console.log('Click 6');
        // await page.click('._5f5mN'); // submit
        console.log('Click 7');
    } catch (e) {
        console.log(e)
        console.log('no sus');
    }
}

async function scrape(data) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://instagram.com', { waitUntil: 'networkidle0' });
    // await page.waitForNavigation();
    // await page, waitForSelector('.aOOlW.bIiDR')
    // await page.click('.aOOlW.bIiDR')
    await page.click('input[name=username]');
    await page.keyboard.type(data.sender);
    console.log('Typed user');
    await page.click('input[name=password]');
    await page.keyboard.type(data.pw);
    console.log('Typed pass');
    await page.click('.DhRcB');
    console.log('Click login');

    // suspicious login attempt
    if (data.code !== '') {
        await sus(page, data.code);
    }
    console.log('normal');
    try {
        await page.waitForSelector('._2dbep.qNELH');
        await page.click('.sqdOP.L3NKy.y3zKF');
        await page.waitForSelector('.aOOlW.HoLwm');
        await page.click('.aOOlW.HoLwm');
    } catch (e) {
        //pass
    }

    await page.goto('https://www.instagram.com/direct/inbox/', {
        waitUntil: 'networkidle0',
    });
    console.log('in dm');
    setTimeout(async () => {
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        console.log(bodyHTML);
    }, 300);
    await page.waitForSelector('._2NzhO.EQ1Mr', { timeout: 60000 });
    await page.click('._2NzhO.EQ1Mr');
    await page.waitForSelector('input[name=queryBox]', { timeout: 60000 });
    await page.keyboard.type(data.user);
    await page.waitForSelector('.dCJp8', { timeout: 60000 });
    await page.click('.dCJp8');
    console.log('got person');
    await page.waitForSelector('.sqdOP.yWX7d.y3zKF.cB_4K');
    await page.click('.sqdOP.yWX7d.y3zKF.cB_4K');
    await page.waitForSelector('.Igw0E.IwRSH.eGOV_.vwCYk.ItkAi');
    await page.click('.Igw0E.IwRSH.eGOV_.vwCYk.ItkAi');
    await page.keyboard.type(data.msg);
    await page.keyboard.press(String.fromCharCode(13));
    console.log('done');
    await browser.close();
}

scrape({
    sender: 'ov.visuals',
    pw: 'AIYOAIYO',
    user: 'akathian.s',
    msg: 'Hi',
    code: '973926'
})