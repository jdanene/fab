import firebase from "firebase/app"
import "firebase/database"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDmf0O7did9GrPKJV0FxuE8DXMJ6lUHY0o",
  authDomain: "fabapp-a1ea0.firebaseapp.com",
  databaseURL: "https://fabapp-a1ea0.firebaseio.com",
  projectId: "fabapp-a1ea0",
  storageBucket: "fabapp-a1ea0.appspot.com",
  messagingSenderId: "418449602579",
  appId: "1:418449602579:web:4ea8b998481214931fa7e6",
  measurementId: "G-PKT3GQ71QK"
};

firebase.initializeApp(firebaseConfig);

const fb= firebase;
export default fb;

