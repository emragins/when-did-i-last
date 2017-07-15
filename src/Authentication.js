import fire from './fire';
import firebase from 'firebase';

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('email');

let token = undefined;

export default class Authentication {
  constructor(onStateChange) {
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        let user = {};
        user.displayName = u.displayName;
        user.email = u.email;
        user.emailVerified = u.emailVerified;
        user.photoURL = u.photoURL;
        user.isAnonymous = u.isAnonymous;
        user.uid = u.uid;
        user.providerData = u.providerData;
        
        if (user.email)
          onStateChange(user);

        // ...
      } else {
        // User is signed out.
        // ...
      }
    });

  }

  initiateSignIn = () => {
    fire.auth().signInWithRedirect(provider)
    fire.auth().getRedirectResult()
      .then((result) => {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          // ...
        }
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

}