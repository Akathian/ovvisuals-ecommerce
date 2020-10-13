import { writeFile } from 'fs';
const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `export const environment = {
    production: true,
    firebaseConfig: {
        apiKey: "${process.env.FIREBASE_API_KEY}",
        authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
        databaseURL: "${process.env.FIREBASE_DB_URL}",
        projectId: "${process.env.FIREBASE_PID}",
        storageBucket: "${process.env.FIREBASE_STORAGE}",
        messagingSenderId: "${process.env.FIREBASE_MSID}",
        appId: "${process.env.FIREBASE_APP_ID}"
    },
    paypal: {
        client: '${process.env.PAYPAL_CLIENT}',
        secret: '${process.env.PAYPAL_SECRET}'
    },
    imgur: {
        client: '${process.env.IMGUR_CLIENT}',
        secret: '${process.env.IMGUR_SECRET}',
        refresh: '${process.env.IMGUR_REFRESH}',
        access: '${process.env.IMGUR_ACCESS}'
    },
    ig: {
        user: '${process.env.IG_USER}',
        pass: '${process.env.IG_PASS}'
    },
    smtp: {
        secure: '${process.env.SMTP_SECURE}',
        from: '${process.env.SMTP_FROM}',
    }
};
`;
writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
