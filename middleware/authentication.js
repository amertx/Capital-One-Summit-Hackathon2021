// npm imports
// import firebase from "firebase/app";

// import "firebase/analytics";
// import "firebase/auth";
// import "firebase/firestore";

// node.js imports - use the npm ones later
var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyBP-E4gj3NXjwaWxDMPgnu7XAljZp_AB4I",
    authDomain: "capitaloneses-85392.firebaseapp.com",
    projectId: "capitaloneses-85392",
    storageBucket: "capitaloneses-85392.appspot.com",
    messagingSenderId: "6491589459",
    appId: "1:6491589459:web:1de3272c313e5e68aeefa6",
    measurementId: "G-SBF0G38D3L",
};

const initFirebase = () => {
    firebase.initializeApp(firebaseConfig);
};

/*
    Creates new user with provided email and password
    returns with a status of 202 and user credentials if successful
    returns status 400 if account exists
    returns status 401 if email is invalid 
*/
const createWithEmail = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            return { status: 202, credentials: user };
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == "auth/email-already-in-use") {
                return { status: 400, error: errorMessage };
            }

            if (errorCode == "auth/invalid-email") {
                return { status: 401, error: errorMessage };
            }
        });
};

/*
    logs in with provided email and password
    returns with a status of 202 and user credentials if successful
    returns status 401 if email is invalid
    returns status 402 if password is incorrect
    returns status 403 if user is not found
*/
const loginWithEmail = (email, password) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            return { status: 202, credentials: user };
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == "auth/invalid-email") {
                return { status: 401, error: errorMessage };
            }

            if (errorCode == "auth/wrong-password") {
                return { status: 402, error: errorMessage };
            }

            if (errorCode == "auth/user-not-found") {
                return { status: 403, error: errorMessage };
            }
        });
};

const signOut = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // signed out
        })
        .catch((error) => {
            // throw error
        });
};

// google oauth
const googleOAuth = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // Google Access Token
            var token = credential.accessToken;

            var user = result.user;

            return { status: 202, credentials: user };
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            return {
                status: 401,
                error: "Something went wrong. Try again later.",
            };
        });
};

// get user
const getUser = () => {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
    }

    return {
        name: name,
        email: email,
        photoUrl: photoUrl,
        emailVerified: emailVerified,
        uid: uid,
    };
};

// get token
const getToken = () => {
    var user = firebase.auth().currentUser;

    return user.getToken();
};

// node
exports.initFirebase = initFirebase;
exports.createWithEmail = createWithEmail;
exports.loginWithEmail = loginWithEmail;
