import * as firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9KBJKoVj4HmJjd4_jEI5OrwidaJbpSug",
  authDomain: "zhungrychatapp.firebaseapp.com",
  databaseURL: "https://zhungrychatapp-default-rtdb.firebaseio.com",
  projectId: "zhungrychatapp",
  storageBucket: "zhungrychatapp.appspot.com",
  messagingSenderId: "812820991580",
  appId: "1:812820991580:web:a0cc80b799fd3aec0ae099",
  measurementId: "G-2PCG50BRV3",
};

let app;
if (firebase.apps.length === 0) {
  
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
  console.log(app);
}

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebase.database();
const storage = firebase.storage();


export { auth, provider, database, storage };
