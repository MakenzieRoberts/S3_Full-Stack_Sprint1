//  Handles all functions related to token creation, querying and expiration.
//  These functions are run by both the command line interface and the web form.

//  Import core modules
const fs = require("fs");
const fsPromises = require("fs").promises;
//  Create event emitter
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
//  Import logger and set to on
const logEvents = require("./logEvents");
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

//  Dependencies for dates and hashing tokens
const crc32 = require("crc/crc32");
const { format } = require("date-fns");
//  Slice for CLI
const myArgs = process.argv.slice(2);

//  Returns a count of total tokens saved in tokens.json
const tokenCount = () => {
  let arr = [];
  if (DEBUG) console.log("token.tokenCount()");
  // return new Promise(function (resolve, reject) {
  fsPromises.readFile(
    __dirname + "/json/tokens.json",
    "utf-8",
    (error, data) => {
      if (error) reject(error);
      else {
        let tokens = JSON.parse(data);
        let count = Object.keys(tokens).length - 1; // Subtract in order to prevent counting the template
        console.log(`Current token count is ${count}.`);
        myEmitter.emit(
          "log",
          "token.tokenCount()",
          "INFO",
          `Current token count is ${count}.`
        );
        arr.push(count);
        return arr;
      }
    }
  );
};

const tokenList = () => {
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
};

// Calculates the expiration date for new tokens
const addDays = (date, days) => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Creates a new token if one doesn't exist
const newToken = async (username) => {
  if (DEBUG) console.log("token.newToken()");

  // Check for existing user
  let result = await existCheck(username);
  if (result[0] == true) {
    console.log(
      `A token already exists for this user. Please use the search option.`
    );
    return "A token already exists for this user. Please use the search option.";
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
        "confirmed": "false"
    }`);

    //  Assign provided username
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
};

// Checks if token exists and returns an array.
// The first index is always a boolean true/false.
// The second index is an object but only when the first index is false.
const existCheck = async (username) => {
  if (DEBUG) console.log("tokens.existCheck()");

  // Set checker to false and instantiate empty array
  let tokenExists = false;
  let arr = [];

  let today = new Date(); // Create today's date variable
  todayStr = Date.parse(today); //  Convert todays date to ISO format
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
        let tokenExp = Date.parse(tokens[i].expires); //  Convert token expiry dates to ISO format
        if (tokenExp + 259200000 <= todayStr) {
          //  Check if expiry date has elapsed
          tokens.splice(i, 1); //  Remove the element from data file

          let userTokens = JSON.stringify(tokens); // Write edited file back to disk
          fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
            if (err) throw err;
          });
          tokenExists = false;
          arr.push(tokenExists);
          return arr;
        } else {
          tokenExists = true;
          arr.push(tokenExists, tokens[i]);
          // Returns the existing token for requested username
          return arr;
        }
      }
    }
  } catch (err) {
    throw err;
  }
  // Push false to first index if no matches found
  arr.push(tokenExists);
  return arr;
};

// Fetches record based on username input
const getRecord = async function (username) {
  if (DEBUG) console.log("token.getRecord()");
  //  Check for username in database
  let result = await existCheck(username);
  if (result[0] == false) {
    //  If no match found
    console.log("No result found.");
    return "No record could be found.";
  } else {
    // Return match
    console.log(result[1]);
    return result[1];
  }
};

//  Search for token by username
const searchToken = async function (username) {
  //  Check for username in database
  let result = await existCheck(username);
  if (result[0] == false) {
    //  If no match found
    console.log("Token does not exist.");
    return "Token does not exist";
  } else {
    //  Return match
    console.log(`Token for username [${username}]: ${result[1].token}`);
    return result[1].token;
  }
};

//  Command line interface application
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
    case "--fetch":
      if (DEBUG) console.log("token.getRecord");
      getRecord(myArgs[2]);
      break;
    case "--search":
      if (DEBUG) console.log("token.searchToken()");
      searchToken(myArgs[3]);
      break;
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
  existCheck,
  getRecord,
  searchToken,
};
