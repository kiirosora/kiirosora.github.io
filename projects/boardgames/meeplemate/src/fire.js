import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyD1enYFjowepoRkrjgEaA33S3OM69YONYQ",
  authDomain: "meeplemate.firebaseapp.com",
  databaseURL: "https://meeplemate.firebaseio.com",
  projectId: "meeplemate",
  storageBucket: "meeplemate.appspot.com",
  messagingSenderId: "150465220380"
};
var fire = firebase.initializeApp(config);
export default fire;