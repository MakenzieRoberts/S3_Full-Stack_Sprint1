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
const fsPromises = require("fs").promises;
const path = require("path");
const myArgs = process.argv.slice(2);
const { configjson } = require("./templates");

function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);
  let match = false;
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    for (let key of Object.keys(cfg)) {
      if (key === myArgs[2]) {
        cfg[key] = myArgs[3];
        match = true;
        console.log(key);
      }
    }
    if (!match) {
      console.log(`invalid key: ${myArgs[2]}, try another.`);
      myEmitter.emit(
        "log",
        "config.setConfig()",
        "CONFIG_WARNING",
        `invalid key: ${myArgs[2]}`
      );
    } else {
      if (DEBUG) console.log(cfg);
      data = JSON.stringify(cfg, null, 2);
      fs.writeFile(__dirname + "/json/config.json", data, (error) => {
        if (error) throw error;
        console.log("Config file successfully updated.");
        myEmitter.emit(
          "log",
          "config.setConfig()",
          "CONFIG_INFO",
          `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`
        );
      });
    }
  });
}

function newConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    let att = JSON.parse(data);
    let key = myArgs[2];
    att[key] = "";
    data = JSON.stringify(att, null, 2);
    fs.writeFile(__dirname + "/json/config.json", data, (error) => {
      if (error) throw error;
      console.log("Config file successfully updated.");
      myEmitter.emit(
        "log",
        "config.setConfig()",
        "CONFIG_INFO",
        `config.json "${myArgs[2]}": updated`
      );
    });
  });
}

function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  let configdata = JSON.stringify(configjson, null, 2);
  fs.writeFile(__dirname + "/json/config.json", configdata, (error) => {
    if (error) throw error;
    console.log("Config file reset to original state");
    myEmitter.emit(
      "log",
      "config.resetConfig()",
      "CONFIG_INFO",
      "config.json reset to original state."
    );
  });
}

function displayConfig() {
  if (DEBUG) console.log("config.displayConfig()");
  fs.readFile(__dirname + "/json/config.json", (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
  });
  myEmitter.emit(
    "log",
    "config.displayConfig()",
    "CONFIG_INFO",
    "config.json displayed"
  );
}

function configApp() {
  if (DEBUG) console.log("configApp()");
  myEmitter.emit(
    "log",
    "config.configApp()",
    "INFO",
    "config option was called by CLI"
  );

  switch (myArgs[1]) {
    case "--show":
      if (DEBUG) console.log("--show");
      displayConfig();
      break;
    case "--reset":
      if (DEBUG) console.log("--reset");
      resetConfig();
      break;
    case "--set":
      if (DEBUG) console.log("--set");
      setConfig();
      break;
    case "--new":
      if (DEBUG) console.log("--new");
      newConfig();
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/views/config.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
      myEmitter.emit(
        "log",
        "config.configApp()",
        "INFO",
        "invalid CLI option, usage displayed"
      );
  }
}

module.exports = {
  configApp,
};
