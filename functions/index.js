const functions = require('firebase-functions');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

async function sus(code) {
  try {
    console.log('trying sus');
    await page.waitForSelector('input[name="choice"]');
    await page.click('._5f5mN.jIbKX.KUBKM.yZn4P');
    await page.waitForSelector('input[name="security_code"]');
    await page.click('input[name="security_code"]');
    await page.keyboard.type(code);
    await page.waitForSelector('._5f5mN');
    await page.click('._5f5mN'); // submit
  } catch (e) {
    console.log('no sus');
  }
}

async function scrape(data) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://instagram.com', { waitUntil: 'networkidle0' });
  // await page.waitForNavigation();

  await page.click('input[name=username]');
  await page.keyboard.type(data.sender);
  console.log('Typed user');
  await page.click('input[name=password]');
  await page.keyboard.type(data.pw);
  console.log('Typed pass');
  await page.click('.DhRcB');
  console.log('Click login');

  // suspicious login attempt
  // await sus(data.code);
  console.log('normal');
  try {
    await page.waitForSelector('._2dbep.qNELH');
    await page.click('.sqdOP.L3NKy.y3zKF');
    await page.waitForSelector('.aOOlW.HoLwm');
    await page.click('.aOOlW.HoLwm');
  } catch (e) {
    //pass
  }

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

exports.helloWorld = functions.https.onCall(async (data, context) => {
  await scrape(data);
  return 'IG Msg Sent';
});
