// don't think we need these anymore, firebaseUI takes care of a good amount of this
// signOut, getUser, getToken are probably useful for the rest of the app

/*
    Creates new user with provided email and password
    returns with a status of 202 and user credentials if successful
    returns status 400 if account exists
    returns status 401 if email is invalid 
*/
export const createWithEmail = (email, password) => {
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
export const loginWithEmail = (email, password) => {
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

// probably should return something
export const signOut = () => {
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
/*
    google oauth in a popup tab
    returns 202 and user tokens if valid
    returns 401 if theres an error
*/
export const googleOAuth = () => {
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
/*
    returns user info/schema
*/
export const getUser = () => {
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
// returns usertoken
export const getToken = () => {
    var user = firebase.auth().currentUser;

    return user.getToken();
};
