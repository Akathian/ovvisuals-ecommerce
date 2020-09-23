/* SmtpJS.com - v3.0.0 */
const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

const emailBody = (imgsHTML, subject, data) => {
   return `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
       <head>
          <!-- NAME: 1 COLUMN -->
          <!--[if gte mso 15]>
          <xml>
             <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
             </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>$</title>
       </head>
       <body style="height:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;width:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#FAFAFA;" >
          <!--*|IF:MC_PREVIEW_TEXT|*-->
          <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none !important;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all;" >${subject}</span><!--<![endif]-->
          <!--*|END:IF|*-->
          <center>
             <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;width:100%;background-color:#FAFAFA;" >
                <tr>
                   <td align="center" valign="top" id="bodyCell" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;width:100%;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-top-width:0;" >
                      <!-- BEGIN TEMPLATE // -->
                      <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                         <tr>
                            <td align="center" valign="top" width="600" style="width:600px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                               <![endif]-->
                               <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;max-width:600px !important;border-width:0;" >
                                  <tr>
                                     <td valign="top" id="templatePreheader" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#FAFAFA;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top-width:0;border-bottom-width:0;padding-top:9px;padding-bottom:9px;" >
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                 <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <!--[if mso]>
                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tr>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                          <td valign="top" width="600" style="width:600px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                             <![endif]-->
             
                                                             <!--[if mso]>
                                                          </td>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                       </tr>
                                                    </table>
                                                    <![endif]-->
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td valign="top" id="templateHeader" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#FFFFFF;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top-width:0;border-bottom-width:0;padding-top:9px;padding-bottom:0;" >
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnImageBlockOuter">
                                              <tr>
                                                 <td valign="top"  class="mcnImageBlockInner" style="padding-top:9px;padding-bottom:9px;padding-right:9px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tbody>
                                                          <tr>
                                                             <td class="mcnImageContent" valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                <img align="center" alt="" src="https://mcusercontent.com/80c4e0529b85d120cd019f4a0/images/2c79a892-92ef-4979-9d09-65010fa43c90.jpg" width="214.32"  class="mcnImage" style="max-width:781px;padding-bottom:0;display:inline !important;vertical-align:bottom;border-width:0;height:auto;outline-style:none;text-decoration:none;-ms-interpolation-mode:bicubic;" >
                                                             </td>
                                                          </tr>
                                                       </tbody>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td valign="top" id="templateBody" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#FFFFFF;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top-width:0;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#EAEAEA;padding-top:0;padding-bottom:9px;" >
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                 <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <!--[if mso]>
                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tr>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                          <td valign="top" width="600" style="width:600px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                             <![endif]-->
                                                             <table align="left" border="0" cellpadding="0" cellspacing="0"  width="100%" class="mcnTextContentContainer" style="max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                <tbody>
                                                                   <tr>
                                                                      <td valign="top" class="mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left;" >
                                                                         <h1 style="display:block;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;color:#202020;font-family:Helvetica;font-size:26px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;" >Thank You, ${data.name}</h1>
                                                                         <p style="margin-top:10px;margin-bottom:10px;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left;" ><span style="font-size:16px;" >I've received your request, and I will get back to you soon! Feel free to reply to this email if you want to add anything. Here's a summary of what I got from your request:</span></p>
                                                                      </td>
                                                                   </tr>
                                                                </tbody>
                                                             </table>
                                                             <!--[if mso]>
                                                          </td>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                       </tr>
                                                    </table>
                                                    <![endif]-->
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td valign="top" id="templateFooter" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#FAFAFA;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top-width:0;border-bottom-width:0;padding-top:9px;padding-bottom:9px;" >
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCodeBlock" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                 <td valign="top" class="mcnTextBlockInner" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <div class="mcnTextContent" style="word-break:break-word;color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center;" >
                                                       <table style="width:100%;font-size:14px;padding-top:1em;padding-bottom:1em;padding-right:1em;padding-left:1em;border-spacing:0 0.7em;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                          <tbody>
                                                             <tr>
                                                                <th>Item</th>
                                                                <th>Type</th>
                                                                <th>Fulfill Date (YYYY-MM-DD)</th>
                                                                <th>Print</th>
                                                                <th>Print Size</th>
                                                                <th>Base Price</th>
                                                             </tr>
                                                             <tr>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >1</td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >${data.service}</td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >${data.date.year}/${data.date.month}/${data.date.day}</td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >${data.printOpt}</td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >${data.size}</td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >CAD$50</td>
                                                             </tr>
                                                             <tr>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ></td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ></td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ></td>
                                                                <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ></td>
                                                                <td style="border-top-width:1px;border-top-style:solid;border-top-color:grey;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >Total:</td>
                                                                <td style="border-top-width:1px;border-top-style:solid;border-top-color:grey;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >CAD$50</td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                       <div style="padding-top:1em;padding-bottom:1em;padding-right:1em;padding-left:1em;" >
                                                          <h4 style="display:block;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;" >Your Message:</h4>
                                                          <p style="text-align:left;font-size:14px;margin-top:10px;margin-bottom:10px;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#656565;font-family:Helvetica;line-height:150%;" >${data.desc}</p>
                                                       </div>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnCodeBlock" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                 <td valign="top" class="mcnTextBlockInner" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <div class="mcnTextContent" style="word-break:break-word;color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center;" >
                                                       <h4 style="padding-left:1em;display:block;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;color:#202020;font-family:Helvetica;font-size:18px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal;text-align:left;" >Images you've provided:</h4>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                        ${imgsHTML}
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnFollowBlockOuter">
                                              <tr>
                                                 <td align="center" valign="top"  class="mcnFollowBlockInner" style="padding-top:9px;padding-bottom:9px;padding-right:9px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentContainer" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tbody>
                                                          <tr>
                                                             <td align="center" style="padding-left:9px;padding-right:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"  class="mcnFollowContent" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                   <tbody>
                                                                      <tr>
                                                                         <td align="center" valign="top" style="padding-top:9px;padding-right:9px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                               <tbody>
                                                                                  <tr>
                                                                                     <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                        <!--[if mso]>
                                                                                        <table align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                           <tr>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                              <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                 <![endif]-->
                                                                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                    <tbody>
                                                                                                       <tr>
                                                                                                          <td valign="top"  class="mcnFollowContentItemContainer" style="padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                             <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                <tbody>
                                                                                                                   <tr>
                                                                                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                         <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                            <tbody>
                                                                                                                               <tr>
                                                                                                                                  <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                                     <a href="https://www.facebook.com/ovvisualss" target="_blank" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png" alt="Facebook"  height="24" width="24" class="" style="display:block;-ms-interpolation-mode:bicubic;border-width:0;height:auto;outline-style:none;text-decoration:none;" ></a>
                                                                                                                                  </td>
                                                                                                                               </tr>
                                                                                                                            </tbody>
                                                                                                                         </table>
                                                                                                                      </td>
                                                                                                                   </tr>
                                                                                                                </tbody>
                                                                                                             </table>
                                                                                                          </td>
                                                                                                       </tr>
                                                                                                    </tbody>
                                                                                                 </table>
                                                                                                 <!--[if mso]>
                                                                                              </td>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                              <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                 <![endif]-->
                                                                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                    <tbody>
                                                                                                       <tr>
                                                                                                          <td valign="top"  class="mcnFollowContentItemContainer" style="padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                             <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                <tbody>
                                                                                                                   <tr>
                                                                                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                         <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                            <tbody>
                                                                                                                               <tr>
                                                                                                                                  <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                                     <a href="https://www.instagram.com/ov.visuals/" target="_blank" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-48.png" alt="Instagram"  height="24" width="24" class="" style="display:block;-ms-interpolation-mode:bicubic;border-width:0;height:auto;outline-style:none;text-decoration:none;" ></a>
                                                                                                                                  </td>
                                                                                                                               </tr>
                                                                                                                            </tbody>
                                                                                                                         </table>
                                                                                                                      </td>
                                                                                                                   </tr>
                                                                                                                </tbody>
                                                                                                             </table>
                                                                                                          </td>
                                                                                                       </tr>
                                                                                                    </tbody>
                                                                                                 </table>
                                                                                                 <!--[if mso]>
                                                                                              </td>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                              <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                 <![endif]-->
                                                                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                    <tbody>
                                                                                                       <tr>
                                                                                                          <td valign="top"  class="mcnFollowContentItemContainer" style="padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                             <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                <tbody>
                                                                                                                   <tr>
                                                                                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                         <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                            <tbody>
                                                                                                                               <tr>
                                                                                                                                  <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                                     <a href="mailto:ovvisuals@gmail.com" target="_blank" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-forwardtofriend-48.png" alt="Email"  height="24" width="24" class="" style="display:block;-ms-interpolation-mode:bicubic;border-width:0;height:auto;outline-style:none;text-decoration:none;" ></a>
                                                                                                                                  </td>
                                                                                                                               </tr>
                                                                                                                            </tbody>
                                                                                                                         </table>
                                                                                                                      </td>
                                                                                                                   </tr>
                                                                                                                </tbody>
                                                                                                             </table>
                                                                                                          </td>
                                                                                                       </tr>
                                                                                                    </tbody>
                                                                                                 </table>
                                                                                                 <!--[if mso]>
                                                                                              </td>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                              <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                 <![endif]-->
                                                                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                    <tbody>
                                                                                                       <tr>
                                                                                                          <td valign="top"  class="mcnFollowContentItemContainer" style="padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                             <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                <tbody>
                                                                                                                   <tr>
                                                                                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                         <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                            <tbody>
                                                                                                                               <tr>
                                                                                                                                  <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                                     <a href="http://ovvisuals.com" target="_blank" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png" alt="Website"  height="24" width="24" class="" style="display:block;-ms-interpolation-mode:bicubic;border-width:0;height:auto;outline-style:none;text-decoration:none;" ></a>
                                                                                                                                  </td>
                                                                                                                               </tr>
                                                                                                                            </tbody>
                                                                                                                         </table>
                                                                                                                      </td>
                                                                                                                   </tr>
                                                                                                                </tbody>
                                                                                                             </table>
                                                                                                          </td>
                                                                                                       </tr>
                                                                                                    </tbody>
                                                                                                 </table>
                                                                                                 <!--[if mso]>
                                                                                              </td>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                              <td align="center" valign="top" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                 <![endif]-->
                                                                                                 <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                    <tbody>
                                                                                                       <tr>
                                                                                                          <td valign="top"  class="mcnFollowContentItemContainer" style="padding-right:0;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                             <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                <tbody>
                                                                                                                   <tr>
                                                                                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                         <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                            <tbody>
                                                                                                                               <tr>
                                                                                                                                  <td align="center" valign="middle" width="24" class="mcnFollowIconContent" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                                                                                     <a href="https://github.com/Akathian" target="_blank" style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" ><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/color-github-48.png" alt="GitHub"  height="24" width="24" class="" style="display:block;-ms-interpolation-mode:bicubic;border-width:0;height:auto;outline-style:none;text-decoration:none;" ></a>
                                                                                                                                  </td>
                                                                                                                               </tr>
                                                                                                                            </tbody>
                                                                                                                         </table>
                                                                                                                      </td>
                                                                                                                   </tr>
                                                                                                                </tbody>
                                                                                                             </table>
                                                                                                          </td>
                                                                                                       </tr>
                                                                                                    </tbody>
                                                                                                 </table>
                                                                                                 <!--[if mso]>
                                                                                              </td>
                                                                                              <![endif]-->
                                                                                              <!--[if mso]>
                                                                                           </tr>
                                                                                        </table>
                                                                                        <![endif]-->
                                                                                     </td>
                                                                                  </tr>
                                                                               </tbody>
                                                                            </table>
                                                                         </td>
                                                                      </tr>
                                                                   </tbody>
                                                                </table>
                                                             </td>
                                                          </tr>
                                                       </tbody>
                                                    </table>
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;table-layout:fixed !important;" >
                                           <tbody class="mcnDividerBlockOuter">
                                              <tr>
                                                 <td class="mcnDividerBlockInner" style="min-width:100%;padding-top:10px;padding-bottom:25px;padding-right:18px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top-width:2px;border-top-style:solid;border-top-color:#EEEEEE;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tbody>
                                                          <tr>
                                                             <td style="mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                <span></span>
                                                             </td>
                                                          </tr>
                                                       </tbody>
                                                    </table>
                                                    <!--            
                                                       <td class="mcnDividerBlockInner" style="padding-top:18px;padding-bottom:18px;padding-right:18px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <hr class="mcnDividerContent" style="border-bottom-color:none;border-left-color:none;border-right-color:none;border-bottom-width:0;border-left-width:0;border-right-width:0;margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;" />
                                                       -->
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                           <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                 <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                    <!--[if mso]>
                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                       <tr>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                          <td valign="top" width="600" style="width:600px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                             <![endif]-->
                                                             <table align="left" border="0" cellpadding="0" cellspacing="0"  width="100%" class="mcnTextContentContainer" style="max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;" >
                                                                <tbody>
                                                                   <tr>
                                                                      <td valign="top" class="mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;word-break:break-word;color:#656565;font-family:Helvetica;font-size:12px;line-height:150%;text-align:center;" >
                                                                         <em>Copyright © 2020 OVVisuals, All rights reserved.</em><br>
                                                                         <br>
                                                                      </td>
                                                                   </tr>
                                                                </tbody>
                                                             </table>
                                                             <!--[if mso]>
                                                          </td>
                                                          <![endif]-->
                                                          <!--[if mso]>
                                                       </tr>
                                                    </table>
                                                    <![endif]-->
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                     </td>
                                  </tr>
                               </table>
                               <!--[if (gte mso 9)|(IE)]>
                            </td>
                         </tr>
                      </table>
                      <![endif]-->
                      <!-- // END TEMPLATE -->
                   </td>
                </tr>
             </table>
          </center>
       </body>
    </html>`
}

module.exports = { Email, emailBody };
