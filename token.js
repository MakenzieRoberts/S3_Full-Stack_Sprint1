/*************************
 * File Name: config.js
 * Purpose: The routines to configure the app
 * 
 * Commands:
myapp token --count                     displays a count of the tokens created
myapp token --list                      list all the usernames with tokens
myapp token --new <username>            generates a token for a given username, saves tokens to the json file
myapp token --upd p <username> <phone>  updates the json entry with phone number
myapp token --upd e <username> <email>  updates the json entry with email
myapp token --fetch <username>          fetches a user record for a given username
myapp token --search u <username>       searches a token for a given username
myapp token --search e <email>          searches a token for a given email
myapp token --search p <phone>          searches a token for a given phone number
 *
 * Created Date: 14 Feb 2022
 * Authors:
 * PJR - Peter Rawsthorne
 * Revisions:
 * Date, Author, Description
 * 14 Feb 2022, PJR, File created
 * 20 Oct 2022, PJR, stealing code from the spring
 *
 *************************/
// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require("./logEvents");

// define/extend an EventEmitter class
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

// Node.js common core global modules
const fs = require("fs");
const crc32 = require("crc/crc32");
const { format } = require("date-fns");

const myArgs = process.argv.slice(2);

let tokenCount = function () {
  if (DEBUG) console.log("token.tokenCount()");
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) reject(error);
      else {
        let tokens = JSON.parse(data);
        let count = Object.keys(tokens).length;
        console.log(`Current token count is ${count}.`);
        myEmitter.emit(
          "log",
          "token.tokenCount()",
          "INFO",
          `Current token count is ${count}.`
        );
        resolve(count);
      }
    });
  });
};

function tokenList() {
  if (DEBUG) console.log("token.tokenList()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log("** User List **");
    tokens.forEach((obj) => {
      console.log(" * " + obj.username + ": " + obj.token);
    });
    myEmitter.emit(
      "log",
      "token.tokenList()",
      "INFO",
      `Current token list was displayed.`
    );
  });
}

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


function newToken(username) {
  if (DEBUG) console.log("token.newToken()");

    let newToken = JSON.parse(`{
        "created": "1969-01-31 12:30:00", 
        "username": "username",
        "email": "user@example.com",
        "phone": "5556597890",
        "token": "token",
        "expires": "1969-02-03 12:30:00",
        "confirmed": "tbd"
    }`);

  let now = new Date();
  let expires = addDays(now, 3);

  newToken.username = username;

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`New token ${newToken.token} was created for ${username}.`);
        myEmitter.emit(
          "log",
          "token.newToken()",
          "INFO",
          `New token ${newToken.token} was created for ${username}.`
        );
      }
    });
  });
  return newToken.token;
}

function existCheck(username){
  let tokenExists = false;
  fs.readFile(__dirname + "/json/tokens.json", "utf8", (error, data) => {
    if (error) throw error;
    const tokens = JSON.parse(data); // Parse JSON to string
    for (let i = 0; i < tokens.length; i ++){
      if (tokens[i].username == username){
        tokenExists = true;
        console.log("Token already issued")
        console.log(tokens[i])
        
      }
      return tokenExists;
    }
})};

const expiryCheck = () =>{
  // Find tokens json file
  fs.readFile(__dirname + "/json/tokens.json", "utf8", (error, data) => {
    if (error) throw error;
    let today = new Date(); 
    todayStr = Date.parse(today); // Convert todays date to ISO format
    const tokens = JSON.parse(data); // Parse JSON to string
    for (let i = 0; i < tokens.length; i ++){
      let tokenExp = Date.parse(tokens[i].expires) // Convert token expiry dates to ISO format
      if (tokenExp + 259200000 <= todayStr){ // Check if expiry date has elapsed
        tokens.splice(i, 1)} // Remove the element from tokens 
    }
    userTokens = JSON.stringify(tokens) 
    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
    if (err) throw err;
})});}





function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  myEmitter.emit(
    "log",
    "token.tokenApp()",
    "INFO",
    "token option was called by CLI"
  );

  switch (myArgs[1]) {
    case "--count":
      if (DEBUG) console.log("token.tokenCount() --count");
      tokenCount();
      break;
    case "--list":
      if (DEBUG) console.log("token.tokenList() --list");
      tokenList();
      break;
    case "--new":
      if (DEBUG) console.log("token.newToken() --new");
      newToken(myArgs[2]);
      break;
    case "--upd":
      if (DEBUG) console.log("token.updateToken()");
      //    updateToken(myArgs);
      break;
    case "--fetch":
      if (DEBUG) console.log("token.fetchToken");
      //    fetchRecord(myArgs[2]);
      break;
    case "--search":
      if (DEBUG) console.log("token.searchToken()");
      //    searchToken();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/views/token.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "log",
        "token.tokenApp()",
        "INFO",
        "invalid CLI option, usage displayed"
      );
  }
}



module.exports = {
  tokenApp,
  newToken,
  tokenCount,
  addDays,
  expiryCheck,
  existCheck
  //   fetchRecord,
};
