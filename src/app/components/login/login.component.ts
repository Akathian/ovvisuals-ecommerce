import { Component, OnInit } from '@angular/core';
import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.renderAccInfo();
  }

  signOut() {
    firebase.auth().signOut();
  }

  renderAccInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
      const loginIMG = `<svg id='logoutImg' width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-person-circle"
      fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
      <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path fill-rule="evenodd"
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
  </svg>`
      if (user) {
        // User is signed in.
        var displayName = user.displayName || 'Guest';
        var email = user.email || '';
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function (accessToken) {
          document.getElementById('sign-in').style.display = 'block'
          document.getElementById('sign-in').textContent = 'Sign out';
          document.getElementById('account-details').textContent = JSON.stringify({
            displayName: displayName,
            email: email,
            emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            providerData: providerData
          }, null, '  ');
          document.getElementById('account-details').textContent = displayName + '\n' + email;
          if (photoURL) {
            document.getElementById('login').innerHTML = `<img id='loginImg' src='${photoURL}' width='26px'/> `
            document.getElementById('loginImg').style.borderRadius = '100%'
          } else {
            document.getElementById('logoutImg').style.fill = 'green'
          }

        });
      } else {
        document.getElementById('sign-in').style.display = 'none';
        document.getElementById('account-details').textContent = '';
        document.getElementById('login').innerHTML = loginIMG
        document.getElementById('logoutImg').style.fill = 'black'
        var uiConfig = {
          signInSuccessUrl: '/login',
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
          ],
          tosUrl: '<your-tos-url>',
          privacyPolicyUrl: function () {
            window.location.assign('<your-privacy-policy-url>');
          }
        };
        try {
          var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
          ui.start('#firebaseui-auth-container', uiConfig);
        } catch (e) {
          console.log(e);
        }
      }
    }, function (error) {
      console.log(error);
    });
  };
}
