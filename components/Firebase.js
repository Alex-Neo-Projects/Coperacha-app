import firebase from "firebase/app";
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyCZc5AT5WRVA0rSLdtNu-EbPF7odPvwL1o",
    authDomain: "coperacha-f7ff5.firebaseapp.com",
    projectId: "coperacha-f7ff5",
    storageBucket: "coperacha-f7ff5.appspot.com",
    messagingSenderId: "143947469885",
    appId: "1:143947469885:web:f2aab6e1e6ad7275954654",
    measurementId: "G-PG9DX0498P"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

const firebaseStorageRef = firebase.storage();

export default firebaseStorageRef;
