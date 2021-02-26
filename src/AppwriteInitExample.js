// AppwriteInit.js - Populate with the correct project id and server URL, and rename the example file to AppwriteInit.js

import * as Appwrite from "appwrite";

let appwrite = new Appwrite();

/* eslint-disable no-unused-vars */
let meta = {autologin: false, // for development purposes to avoid OAuth
           email: "mail@emailaddress.com",
           password: "PASSWORD",
           url: "https://[HOSTNAME_OR_IP]/"}


/* eslint-enable no-unused-vars */

export default {appwrite: appwrite
    .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2'),
    meta: meta}
;
