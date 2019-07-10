import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBPY9uVPAYwaRPrDVPD18ph0bOjFv43TfA",
    authDomain: "carrental-c3155.firebaseapp.com",
    databaseURL: "https://carrental-c3155.firebaseio.com",
    projectId: "carrental-c3155",
    storageBucket: "carrental-c3155.appspot.com",
    messagingSenderId: "61594194756",
    appId: "1:61594194756:web:3ba8effb822d67c4"
  };

firebase.initializeApp(config)

export default firebase
