const functions = require('firebase-functions');
const express = require('express');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const ImageTools = require('./imgTools')
const FormData = require('form-data');

global.Headers = fetch.Headers;
global.URLSearchParams
const app = express();

let uploadedImgs = []
let imgsHTML = ''

async function sus(page, code, valid) {
  try {
    console.log('trying sus');
    await page.waitForSelector('input[name="choice"]');
    console.log('Click 1');
    await page.click('._5f5mN.jIbKX.KUBKM.yZn4P');
    console.log('Click 2');
    await page.waitForSelector('input[name="security_code"]');
    console.log('Click 3');
    if (valid) {
      await page.click('input[name="security_code"]');
      console.log('Click 4');
      await page.keyboard.type(code);
      console.log('Click 5');
      await page.waitForSelector('._5f5mN');
      console.log('Click 6');
      await page.click('._5f5mN'); // submit
      console.log('Click 7');
    }
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
  try {
    await page.click('.aOOlW.bIiDR');
  } catch (e) {
    //
  }
  console.log()
  await page.click('input[name=username]');
  let user = functions.config().ig.user
  await page.keyboard.type(user);
  console.log('Typed user');
  await page.click('input[name=password]');
  let pass = functions.config().ig.pass
  await page.keyboard.type(pass);
  console.log('Typed pass');
  await page.click('.DhRcB');
  console.log('Click login');

  // suspicious login attempt
  if (data.code !== '') {
    await sus(page, data.code, data.valid_code);
  }
  console.log('normal');
  try {
    await page.waitForSelector('._2dbep.qNELH');
    console.log('click 1');
    await page.click('.sqdOP.L3NKy.y3zKF');
    console.log('click 2');
    await page.waitForSelector('.aOOlW.HoLwm');
    console.log('click 3');
    await page.click('.aOOlW.HoLwm');
    console.log('click 4');
  } catch (e) {
    setTimeout(async () => {
      let bodyHTML = await page.evaluate(() => document.body.innerHTML);
      console.log(bodyHTML);
    }, 0);
  }
  await page.goto('https://www.instagram.com/direct/inbox/', {
    waitUntil: 'networkidle0',
  });

  console.log('in dm');
  await page.waitForSelector('._2NzhO.EQ1Mr', { timeout: 60000 });
  await page.click('._2NzhO.EQ1Mr');
  await page.waitForSelector('input[name=queryBox]', { timeout: 60000 });
  await page.keyboard.type(data.recipient);
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

exports.paypalTracking = functions.https.onCall(async (data) => {
  const tid = data.tid
  const tracking = data.tracking
  const carrier = data.carrier
  const carrier_other = data.carrier_other
  const status = data.status

  const PAYPAL_CLIENT = functions.config().paypal.client
  const PAYPAL_SECRET = functions.config().paypal.secret
  const PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
  const PAYPAL_ORDER_API = `https://api.sandbox.paypal.com/v1/shipping/trackers-batch`;
  const basicAuth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString('base64')

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Basic ${basicAuth}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  fetch(PAYPAL_OAUTH_API, {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  })
    .then((response) => response.text())
    .then((result) => {
      const token = JSON.parse(result).access_token;
      const trackHeaders = new Headers();
      let req;
      if (carrier_other) {
        req = {
          trackers: [
            {
              transaction_id: `${tid}`, // need to get seller tid
              tracking_number: `${tracking}`,
              status: `${status}`,
              carrier: `${carrier}`,
              carrier_name_other: `${carrier_other}`,
            },
          ],
        };
      } else if (!carrier_other && carrier) {
        req = {
          trackers: [
            {
              transaction_id: `${tid}`, // need to get seller tid
              tracking_number: `${tracking}`,
              status: `${status}`,
              carrier: `${carrier}`,
            },
          ],
        };
      }

      const raw = JSON.stringify(req);
      trackHeaders.append('Content-Type', 'application/json');
      trackHeaders.append('Authorization', `Bearer ${token}`);
      fetch(PAYPAL_ORDER_API, {
        method: 'POST',
        body: raw,
        headers: trackHeaders,
        redirect: 'follow',
      })
        .then((response2) => response2.text())
        .then(() => {
          //
        })
        .catch((err) => {
          console.log(err)
          //
        });
    })
    .catch((err) => {
      console.log(error)
      //
    });

  return 'Paypal tracking updated';
});

exports.sendEmail = functions.https.onCall(async (data) => {
  return functions.config().smtp.secure
})

exports.imgurUpload = functions.https.onCall(async(files) => {
    uploadedImgs = []
    imgsHTML = ''
    const formdata = new FormData();
    formdata.append('refresh_token', functions.config().imgur.refresh);
    formdata.append('client_id', functions.config().imgur.client);
    formdata.append('client_secret', functions.config().imgur.secret);
    formdata.append('grant_type', 'refresh_token');

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    // eslint-disable-next-line prettier/prettier
    const fetched = await fetch('https://api.imgur.com/oauth2/token', requestOptions)
    const text = await fetched.text();
    let access;
    try {
       access = JSON.parse(text).access_token;
    } catch(e){
       access = functions.config().imgur.access
    }
    await createAlbum(access, files);
    return {
      uploadedImgs,
      imgsHTML
    }
})

async function createAlbum(access, files) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${access}`);
  // myHeaders.append("Authorization", `Client-ID ${environment.imgur.client}`);
  const name = 'testAlbum';
  const formdata = new FormData();
  // formdata.append("ids[]", files);
  formdata.append('title', name);
  formdata.append('description', `Album ${name}`);
  formdata.append('privacy', 'hidden');


  const albumId = 'd40tRSN';
  for (let i = 0; i < files.length; i += 1) {
    await createImg(access, albumId, files[i]);
  }
}

async function createImg(access, albumid, file) {
  // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${access}`);

  const formdata = new FormData();
  
  // console.log(file.data.split(';base64,')[1])
  formdata.append('image', file.data.split(';base64,')[1]);
  formdata.append('album', albumid);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  }
  const fetched = await fetch('https://api.imgur.com/3/image', requestOptions)
  const text = await fetched.text()
  const data = JSON.parse(text).data
  const imageURL = data.link
  console.log(imageURL)

  const img = `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageCardBlock" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
    <tbody class="mcnImageCardBlockOuter">
      <tr>
          <td class="mcnImageCardBlockInner" valign="top" style="padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
            <table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnImageCardBottomContent" width="100%" style="background-color:#404040;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                <tbody>
                  <tr>
                      <td class="mcnImageCardBottomImageContent" align="left" valign="top" style="padding-top:0px;padding-right:0px;padding-bottom:0;padding-left:0px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                        <img alt="" src="${imageURL}" width="564"  class="mcnImage" style="max-width:1200px;border-width:0;height:auto;outline-style:none;text-decoration:none;-ms-interpolation-mode:bicubic;vertical-align:bottom;" >
                      </td>
                  </tr>
                </tbody>
            </table>
          </td>
      </tr>
    </tbody>
  </table>`;

  uploadedImgs.push(imageURL);
  imgsHTML += img;
}