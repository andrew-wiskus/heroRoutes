var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAiarxbEV9Q-4T0eF7LKYnZM5TqlUrjJhU",
    authDomain: "deskboss-beb70.firebaseapp.com",
    databaseURL: "https://deskboss-beb70.firebaseio.com",
    storageBucket: "deskboss-beb70.appspot.com",
};

// var ref = new firebase('https://deskboss-beb70.firebaseio.com');
var useremail = ref.getAuth().password.email;


firebase.initializeApp(config);




//login
function login(email, password) {
    var auth = firebase.auth();

    var promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(function(e) {
        console.log("FIRST LOG", e.message);
    })
}

//sign up
function signup(email, password) {
  var promise = auth.createUserWithEmailAndPassword(email, password);
  promise.catch(function(e) {
      console.log("SECOND LOG", e.message);
      console.log('HEY IT WORKS', useremail);
  });

}

//sign out
function signOut() {
    firebase.auth().signOut();
}


//get user
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
        console.log('User:', firebaseUser.email);
    } else {
        console.log('not logged in');
    }
});




exports.userLogin = {
    start: function() {
        return "";
    },
    login: login,
    signup: signup
};

// //check connection
// function checkConnection() {
//     var dbRef = firebase.database().ref().child('header');
//     dbRef.on('value', function(snap) {
//         console.log(snap.val())
//     });
// }
