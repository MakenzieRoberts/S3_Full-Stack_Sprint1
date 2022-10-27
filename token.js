const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const fs = require("fs");
const fsPromises = require("fs").promises;
const crc32 = require("crc/crc32");
const { format } = require("date-fns");

const myArgs = process.argv.slice(2);

let arr = [];
let tokenCount = function () {
  if (DEBUG) console.log("token.tokenCount()");
  // return new Promise(function (resolve, reject) {
  fsPromises.readFile(
    __dirname + "/json/tokens.json",
    "utf-8",
    (error, data) => {
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
        arr.push(count);
        // resolve(count);
        return arr;
      }
      // }
      // );
    }
  );
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

// Calculates the expiration date for new tokens
function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Creates a new token if one doesn't exist
async function newToken(username) {
  if (DEBUG) console.log("token.newToken()");

  // Check for existing user
  let result = await existCheck(username);
  if (result[0] == true) {
    console.log(`Token already exists. Please use ${result[1].token}`);
    return "Token already exists."
  } else {
    // Create the new token object with template objects
    // TODO: Add form inputs for other info
    let newToken = JSON.parse(`{
        "created": "1969-01-31 12:30:00", 
        "username": "username",
        "email": "user@example.com",
        "phone": "5556597890",
        "token": "token",
        "expires": "1969-02-03 12:30:00",
        "confirmed": "tbd"
    }`);
  
    //  Assign provided sername
    newToken.username = username;
    //  Assign creation date
    let now = new Date();
    newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
    //  Create hashed token using CRC32 library
    newToken.token = crc32(username).toString(16);
    //  Determine expiration date
    let expires = addDays(now, 3);
    newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

    //  Read from Tokens database
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) throw error;
      //  Add token to extant collection of data
      let tokens = JSON.parse(data);
      tokens.push(newToken);
      let userTokens = JSON.stringify(tokens);

      // Write the newly changed data back to the database
      fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
        if (err) console.log(err);
        else {
          console.log(
            `New token ${newToken.token} was created for ${username}.`
          );
          //  Log the new event
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
}

// Checks if token exists and returns an array
const existCheck = async (username) => {
  if (DEBUG) console.log("tokens.existCheck()");
  // Set checker to false and instantiate empty array
  let tokenExists = false;
  let arr = [];
  try {
    // Read tokens data file
    const readTokens = await fsPromises.readFile(
      __dirname + "/json/tokens.json",
      "utf8"
    );
    const tokens = JSON.parse(readTokens);

    // Iterate through data incerementally
    for (let i = 0; i < tokens.length; i++) {
      // Search for a username match
      if (tokens[i].username == username) {
        // Set checker to true
        tokenExists = true;
        arr.push(tokenExists, tokens[i]);
        return arr;
      }
    }
  } catch (err) {
    throw err;
  }
  arr.push(tokenExists);
  return arr;
};

// Checks for expired tokens and removes them from the database
const expiryCheck = () => {
  if (DEBUG) console.log("token.expiryCheck()");

  // Find tokens json file
  fs.readFile(__dirname + "/json/tokens.json", "utf8", (error, data) => {
    if (error) throw error;
    let today = new Date();
    todayStr = Date.parse(today); // Convert todays date to ISO format
    const tokens = JSON.parse(data); // Parse JSON to string
    for (let i = 0; i < tokens.length; i++) {
      let tokenExp = Date.parse(tokens[i].expires); // Convert token expiry dates to ISO format
      if (tokenExp + 259200000 <= todayStr) {
        // Check if expiry date has elapsed
        tokens.splice(i, 1);
      } // Remove the element from tokens
    }
    userTokens = JSON.stringify(tokens);
    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) throw err;
    });
  });
};

// Fetches record based on username input
const getRecord = async function (username) {
  if (DEBUG) console.log("token.getRecord()");
  let result = await existCheck(username);
  if (result[0] == false) {
    return "No record could be found."
  } else return  result[1];
};

// 
const searchToken = async function (username) {
  let result = await existCheck(username);
  if (result[0] == false) {
    return "Token does not exist"
  } else return result[1].token;
};

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
      existCheck();
      expiryCheck();
      newToken(myArgs[2]);
      break;
    case "--fetch":
      if (DEBUG) console.log("token.getRecord");
      getRecord(myArgs[2]);
      break;
    case "--search":
      if (DEBUG) console.log("token.searchToken()");
      searchToken(myArgs[3]);
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
  existCheck,
  arr,
  getRecord,
  searchToken,
};
