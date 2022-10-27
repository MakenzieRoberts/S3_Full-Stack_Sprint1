const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

const {
  folders,
  configjson,
  tokenjson,
  inittxt,
  usagetxt,
  configtxt,
  tokentxt,
} = require("./templates");
const myArgs = process.argv.slice(2);

function createFiles() {
  if (DEBUG) console.log("init.createFiles()");
  try {
    let configdata = JSON.stringify(configjson, null, 2);
    if (!fs.existsSync(path.join(__dirname, "./json/config.json"))) {
      fs.writeFile("./json/config.json", configdata, (err) => {
        if (DEBUG) console.log("Data written to config file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "config.json successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "config.json already exists."
      );
    }
    let tokendata = JSON.stringify(tokenjson, null, 2);
    if (!fs.existsSync(path.join(__dirname, "./json/tokens.json"))) {
      fs.writeFile("./json/tokens.json", tokendata, (err) => {
        if (DEBUG) console.log("Data written to token file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "tokens.json successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "token.json already exists."
      );
    }
    if (!fs.existsSync(path.join(__dirname, "./views/usage.txt"))) {
      fs.writeFile("./views/usage.txt", usagetxt, (err) => {
        if (DEBUG) console.log("Data written to usage.txt file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "./views/usage.txt successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "./views/usage.txt already exists."
      );
    }
    if (!fs.existsSync(path.join(__dirname, "./views/init.txt"))) {
      fs.writeFile("./views/init.txt", inittxt, (err) => {
        if (DEBUG) console.log("Data written to init.txt file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "./views/init.txt successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "./views/init.txt already exists."
      );
    }
    if (!fs.existsSync(path.join(__dirname, "./views/config.txt"))) {
      fs.writeFile("./views/config.txt", configtxt, (err) => {
        if (DEBUG) console.log("Data written to config.txt file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "./views/config.txt successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "./views/config.txt already exists."
      );
    }
    if (!fs.existsSync(path.join(__dirname, "./views/token.txt"))) {
      fs.writeFile("./views/token.txt", tokentxt, (err) => {
        if (DEBUG) console.log("Data written to token.txt file");
        myEmitter.emit(
          "log",
          "init.createFiles()",
          "INIT_INFO",
          "./views/token.txt successfully created."
        );
      });
    } else {
      myEmitter.emit(
        "log",
        "init.createFiles()",
        "INIT_WARNING",
        "./views/token.txt already exists."
      );
    }
  } catch (err) {
    console.log(err);
  }
}

function createFolders() {
  if (DEBUG) console.log("init.createFolders()");
  let mkcount = 0;
  folders.forEach((element) => {
    if (DEBUG) console.log(element);
    try {
      if (!fs.existsSync(path.join(__dirname, element))) {
        fsPromises.mkdir(path.join(__dirname, element));
        mkcount++;
      }
    } catch (err) {
      console.log(err);
    }
  });
  if (mkcount === 0) {
    if (DEBUG) console.log("All folders already exist.");
  } else if (mkcount <= folders.length) {
    if (DEBUG)
      console.log(mkcount + " of " + folders.length + " folders were created.");
  } else {
    if (DEBUG) console.log("All folders successfully created.");
  }
}
function initializeApp() {
  if (DEBUG) console.log("initializeApp()");

  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("--all createFolders() & createFiles()");
      createFolders();
      createFiles();
      break;
    case "--cat":
      if (DEBUG) console.log("--cat createFiles()");
      createFiles();
      break;
    case "--mk":
      if (DEBUG) console.log("--mk createFolders()");
      createFolders();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/views/init.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "log",
        "init.createFiles().createFolders()",
        "INIT_WARNING",
        "invalid CLI option, usage displayed"
      );
  }
}

module.exports = {
  initializeApp,
};
