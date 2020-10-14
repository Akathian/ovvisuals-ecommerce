const express = require('express');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const FormData = require('form-data');

global.Headers = fetch.Headers;
global.URLSearchParams;
async function main() {
  const formdata = new FormData();
  formdata.append('refresh_token', '91bf1e16fd5746a7b1241782eeaa0065f12441e3');
  formdata.append('client_id', '40a4c07be6fae27');
  formdata.append('client_secret', 'ec97d9e0c406f42f49862b0f7a8db329ac853aea');
  formdata.append('grant_type', 'refresh_token');

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };
  // eslint-disable-next-line prettier/prettier
  const fetched = await fetch('https://api.imgur.com/oauth2/token', requestOptions)
  const text = await fetched.text();
  const access = JSON.parse(text).access_token;
  // const access = JSON.parse(
  //   await (
  //     await fetch('https://api.imgur.com/oauth2/token', requestOptions)
  //   ).text()
  // ).access_token;
  // await createAlbum(access, files);
  return {
    uploadedImgs,
    imgsHTML,
  };
}

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
  formdata.append('image', file);
  formdata.append('album', albumid);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };
  const imageURL = JSON.parse(
    await (await fetch('https://api.imgur.com/3/image', requestOptions)).text()
  ).data.link;

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

main();
