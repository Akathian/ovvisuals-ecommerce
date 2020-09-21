import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment"
import { ImageTools } from "../../assets/js/imgTools"
@Injectable({
  providedIn: 'root'
})
export class ImgurService {
  access = "aa";
  albumName;
  files;
  uploadedImgs = [];
  imgsHTML = ''
  constructor() { }

  async auth(files) {
    let formdata = new FormData();
    formdata.append("refresh_token", environment.imgur.refresh);
    formdata.append("client_id", environment.imgur.client);
    formdata.append("client_secret", environment.imgur.secret);
    formdata.append("grant_type", "refresh_token");

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    const access = JSON.parse(await (await fetch("https://api.imgur.com/oauth2/token", <RequestInit>requestOptions)).text()).access_token
    await this.createAlbum(access, files)
  }

  async createAlbum(access, files) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access}`);
    // myHeaders.append("Authorization", `Client-ID ${environment.imgur.client}`);
    let name = "testAlbum"
    var formdata = new FormData();
    // formdata.append("ids[]", files);
    formdata.append("title", name);
    formdata.append("description", `Album ${name}`);
    formdata.append("privacy", "hidden");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    // const albumId = JSON.parse(await (await fetch("https://api.imgur.com/3/album", <RequestInit>requestOptions)).text()).data.id
    const albumId = "d40tRSN"
    for (let i = 0; i < files.length; i++) {
      await this.createImg(access, albumId, files[i])
    }
  }

  async createImg(access, albumid, file) {
    let self = this
    let resizeFile: File;
    ImageTools.resize(file, {
      width: 320, // maximum width
      height: 1000 // maximum height
    }, async function (blob, didItResize) {
      // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
      var b: any = blob
      b.lastModifiedDate = new Date();
      resizeFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access}`);

      var formdata = new FormData();
      formdata.append("image", resizeFile);
      formdata.append("album", albumid);


      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      const imageURL = JSON.parse(await (await fetch("https://api.imgur.com/3/image", <RequestInit>requestOptions)).text()).data.link

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
      </table>`

      self.uploadedImgs.push(imageURL)
      self.imgsHTML += img
    });

  }
}
