

import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({

    apiKey: "AIzaSyD0u78LctUx0oRLrQetoQ_QoMY6wt8WR34",
    authDomain: "instagram-clone-9e84d.firebaseapp.com",
    databaseURL: "https://instagram-clone-9e84d.firebaseio.com",
    projectId: "instagram-clone-9e84d",
    storageBucket: "instagram-clone-9e84d.appspot.com",
    messagingSenderId: "881458156303",
    appId: "1:881458156303:web:11504ddb363c4c6178247a",
    measurementId: "G-1JJ8PRP0TL"


});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
export  {db, auth, storage };

