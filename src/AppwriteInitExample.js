// AppwriteInit.js - Populate with the correct project id and server URL, and rename the example file to AppwriteInit.js

import * as Appwrite from "appwrite";

let appwrite = new Appwrite();

export default appwrite
    .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2') // Your project ID
;
