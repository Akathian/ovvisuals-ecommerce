// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD5QigH20Esd4EhaS4X8tv-FcL0jFMvA1E",
    authDomain: "ovvisuals-ecommerce.firebaseapp.com",
    databaseURL: "https://ovvisuals-ecommerce.firebaseio.com",
    projectId: "ovvisuals-ecommerce",
    storageBucket: "ovvisuals-ecommerce.appspot.com",
    messagingSenderId: "391233476360",
    appId: "1:391233476360:web:74071ce2d003e88f82febd"
  },
  paypal: {
    client: "AUzHPk1_nr1WKmm9NE6srTNO1TWEfggxW04RZELfVYpxw5qCBV0Y2rXawKfNwZa434URXOcwy6XFbms5",
    secret: "ELYUuMU1e5MugtOxhwmVLNwbc-_ZyP6KwEQ0dMzyMi45qjColyVBDz9h94S3WRbRzBA1Y9CYc_tKIKU_"
  },
  imgur: {
    refresh: "47e328a6eb81a9247976c9d93b01f2a449199491",
    client: "40a4c07be6fae27",
    secret: "5d1e167cd36ad2ac1fde7820253e51fc80be00b9"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
