import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyC315b9dYAfcpMvMdvXqwL3ei6iot52HBY",
    authDomain: "test-react-2a94f.firebaseapp.com",
    databaseURL: "https://test-react-2a94f.firebaseio.com",
    projectId: "test-react-2a94f",
    storageBucket: "test-react-2a94f.appspot.com",
    messagingSenderId: "229556082059"
};
var fire = firebase.initializeApp(config);
export default fire;