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
const { tokenApp } = require("./token.js");

// DT: Argv assigned to myArgs variable is part of the common core of node,
// DT: when global debug is true this will evaluate to true initilizing the if statment / block of code and
// displaying it in the terminal

// DT: const myArgs = process.argv.slice(2);, if slice(2) is there it will start the display with what is in position 2
// DT: NOTE: process.argv is needed for the debug, this creates an array assigning it to the myArgs variable name,
// can enter node myapp.js, node myapp init, node myapp init --all in terminal, all the arguments passed get displayed
const myArgs = process.argv.slice(2);
if (DEBUG) if (myArgs.length >= 1) console.log("the myapp.args: ", myArgs);

// DT: this switch statement will check if in terminal a user types in 1 of the commands,
// if not default is activated at the bottom, displaying the help file
switch (myArgs[0]) {
  // DT: does a switch on the "init or i"
  // init or i lets the app into the case specific to that key word.
  case "init":
  case "i":
    // DT: makes it into this debug statement and prints the "initialize the app" or which ever case is selected
    // if no case is selected default will run
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
  //DT: if help or h is selected then everything including the default will run, or if the app is initilized
  // without a selected command this default runs automatically
  case "--help":
  case "--h":
  default:
    // DT: __dirname is the local directory name of the current module.
    // If "/usage.txt", is not there throw an error, otherwise write to console
    // when running this "node myapp.js", the default statement will activate first,
    //then a user can type in a command and the switch case will check for the input
    fs.readFile(__dirname + "/usage.txt", (error, data) => {
      // DT: shows me the directory name in the console log
      if (error) throw error;
      console.log(data.toString());
    });
}
