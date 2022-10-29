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

function addDays(date, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function newToken(username) {
  if (DEBUG) console.log("token.newToken()");

  let result = await existCheck(username);

  // Change this below:
  if (result[0] == true) {
    console.log(
      `A token already exists for this user. Please use the search option.`
    );
    myEmitter.emit(
      "log",
      "token.newToken()",
      "TOKEN_WARNING",
      `Token for ${username} already exists.`
    );
    return "A token already exists for this user. Please use the search option.";
  } else {
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
      let userTokens = JSON.stringify(tokens);

      fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
        if (err) console.log(err);
        else {
          console.log(
            `New token ${newToken.token} was created for ${username}.`
          );
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

// Checks for existing token and returns ___?
const existCheck = async (username) => {
  if (DEBUG) console.log("tokens.existCheck()");
  let tokenExists = false;
  let arr = [];
  try {
    const readTokens = await fsPromises.readFile(
      __dirname + "/json/tokens.json",
      "utf8"
    );
    const tokens = JSON.parse(readTokens);
    for (let i = 0; i < tokens.length; i++) {
      // Search for a username match
      if (tokens[i].username == username) {
        let tokenExp = Date.parse(tokens[i].expires); //  Convert token expiry dates to ISO format
        if (tokenExp + 259200000 <= todayStr) {
          //  If token expiry date is in the past
          tokens.splice(i, 1); //  Remove the element from data file
          let userTokens = JSON.stringify(tokens); // Write edited file back to disk
          fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
            if (err) throw err;
          });
          arr.push(tokenExists);
          myEmitter.emit(
            "log",
            "token.newToken()",
            "TOKEN_INFO",
            `Expired token ${newToken.token} was removed for ${username}.`
          );
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
  arr.push(tokenExists);
  myEmitter.emit(
    "log",
    "token.newToken()",
    "TOKEN_WARNING",
    `No token exists for ${username}.`
  );
  return arr;
};

// Checks for expired tokens and removes them from the database
// TODO: does not run at same time as calling newToken
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

const fetchRecord = async function (record) {
  let arr = [];
  console.log(record);
  let result = await existCheck(record);
  if (result[0] == false) {
    //  If no match found
    console.log("No result found.");
    myEmitter.emit(
      "log",
      "token.fetchRecord()",
      "TOKEN_WARNING",
      `Record for ${record} was NOT fetched.`
    );
    return "No record could be found.";
  } else {
    // Return match
    console.log(result[1]);
    myEmitter.emit(
      "log",
      "token.fetchRecord()",
      "TOKEN_INFO",
      `Record for ${username} was fetched.`
    );
    return result[1];
  }
  // return "Kara";
};

const searchRecord = async function (record) {
  console.log(record);
  let result = await existCheck(record);
  if (result[0] == false) {
    //  If no match found
    console.log("Token does not exist.");
    myEmitter.emit(
      "log",
      "token.searchRecord()",
      "TOKEN_WARNING",
      `Token for ${record} was NOT retrieved.`
    );
    return "Token does not exist";
  } else {
    //  Return match
    console.log(`Token for username [${username}]: ${result[1].token}`);
    myEmitter.emit(
      "log",
      "token.searchRecord()",
      "TOKEN_INFO",
      `Token for ${record} was retrieved.`
    );
    return result[1].token;
  }
};

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  myEmitter.emit(
    "log",
    "token.tokenApp()",
    "TOKEN_INFO",
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
      if (DEBUG) console.log("token.fetchRecord");
      fetchRecord(myArgs[2]);
      break;
    case "--search":
      if (DEBUG) console.log("token.searchToken()");
      searchRecord(myArgs[3]);
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
  fetchRecord,
  searchRecord,
};
