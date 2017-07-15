import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyCHw5gcvZNdBrLwwHTNT6d7Y51Q0CNSBkY",
    authDomain: "when-did-i-last-f7108.firebaseapp.com",
    databaseURL: "https://when-did-i-last-f7108.firebaseio.com",
    projectId: "when-did-i-last-f7108",
    storageBucket: "when-did-i-last-f7108.appspot.com",
    messagingSenderId: "26675013189"
  };
var fire = firebase.initializeApp(config);
export default fire;