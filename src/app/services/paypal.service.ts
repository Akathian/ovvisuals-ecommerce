import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor() { }

  giveTracking(tid, tracking, carrier, carrier_other, status) {
    const self = this;
    const PAYPAL_CLIENT = environment.paypal.client;
    const PAYPAL_SECRET = environment.paypal.secret;
    const PAYPAL_OAUTH_API = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
    const PAYPAL_ORDER_API = `https://api.sandbox.paypal.com/v1/shipping/trackers-batch`;
    const basicAuth = btoa(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Basic ${basicAuth}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');

    fetch(PAYPAL_OAUTH_API, {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    })
      .then(response => response.text())
      .then(result => {
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
                carrier_name_other: `${carrier_other}`
              },
            ]
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
            ]
          };
        }

        const raw = JSON.stringify(req);
        trackHeaders.append('Content-Type', 'application/json');
        trackHeaders.append('Authorization', `Bearer ${token}`);
        fetch(PAYPAL_ORDER_API, {
          method: 'POST',
          body: raw,
          headers: trackHeaders,
          redirect: 'follow'
        }).then(response2 => response2.text())
          .then(result2 => { })
          .catch(error2 => console.log('error', error2));
      })
      .catch(error => console.log('error', error));
  }
}
