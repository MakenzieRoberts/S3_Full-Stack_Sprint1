/*************************
 * myapp.js
 * Application to handle token generation and expiry and user creation on both a command line and a web form.
 *
 * Project forked from Peter Rawsthorne's "myapp"
 *
 * Refer to README.md for detailed explanation of use.
 *
 * Instructions:
 *  1. In terminal, navigate to file directory containing app
 *  2. Input "npm i" to install required dependencies
 *  3. Input "node myapp init --all" to initialize and install application
 *  4. Input "node myapp" for a detailed list of commands to then use
 *  NOTE: Should you wish to recieve detailed console logging, set global.DEBUG to true (line 36)
 * Additional server instructions:
 *  5. In a separate terminal, navigate to file directory containing app.
 *  6. Input "node server" to run web server.
 *  7. Navigate in a web browser to "localhost:3500"
 *  8. The webform will allow the user to generate, display and search tokens and user records.
 *  (See server.js for more details)
 *
 * Commands:
 * see usage.txt file
 *
 * Created Date: 09 Jan 2022
 * Authors:
 * Peter Rawsthorne (original author)
 * Kara Balsom
 * David Turner
 * Glen May
 * Makenzie Roberts
 *
 *************************/

//  Set to true to recieve detailed console logging
global.DEBUG = false;

//  Import core module
const fs = require("fs");

//  Import custom modules
const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp } = require("./token.js");

//  Extract user command line input
const myArgs = process.argv.slice(2);
if (DEBUG) if (myArgs.length >= 1) console.log("the myapp.args: ", myArgs);

//  Execute main administrative functions based on user input
switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], " - initialize the app.");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(myArgs[0], " - display the configuration file");
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], " - generate a user token");
    tokenApp();
    break;
  case "--help": // Redirect to default usage instructions
  case "--h":
  default:
    fs.readFile(__dirname + "/views/usage.txt", (error, data) => {
      if (error) throw error;
      console.log(data.toString());
    });
}
