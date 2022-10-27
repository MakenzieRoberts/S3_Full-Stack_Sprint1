/*************************
 * File Name: myapp.js
 * Purpose: The main routines to start the initialization app
 *
 * Commands:
 * see usage.txt file
 *
 * Created Date: 09 Jan 2022
 * Authors:
 * PJR - Peter Rawsthorne
 * Revisions:
 * Date, Author, Description
 * 09 Jan 2022, PJR, File created
 *
 *************************/
// DT: Global.Debug, this set as true will show if its a successful run of the node myapp init for example or any CLI command available
// , false will not show, basically an On/Off
global.DEBUG = false;
const fs = require("fs");
const { initializeApp } = require("./init.js");
const { configApp } = require("./config.js");
const { tokenApp, expiryCheck } = require("./token.js");

const myArgs = process.argv.slice(2);
if (DEBUG) if (myArgs.length >= 1) console.log("the myapp.args: ", myArgs);

//Token validation occurs every time app is loaded
expiryCheck();

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
  case "--help":
  case "--h":
  default:
    fs.readFile(__dirname + "/usage.txt", (error, data) => {
      if (error) throw error;
      console.log(data.toString());
    });
}
