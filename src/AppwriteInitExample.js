// AppwriteInit.js - Populate with the correct project id and server URL, and rename the example file to AppwriteInit.js

let sdk = new Appwrite();

sdk
    .setEndpoint('https://[HOSTNAME_OR_IP]/v1') // Your API Endpoint
    .setProject('5df5acd0d48c2') // Your project ID
;
