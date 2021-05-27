// import { loginEmail } from "./middleware/authentication";

const auth = require("./middleware/authentication");

console.log("Hello world");

// node
auth.initFirebase();
console.log(auth.loginWithEmail("test@mail.com", "password"));
