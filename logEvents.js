/*----------------------------------------------------------------------
File Name: logEvents.js
Purpose: To provide a logging feature to specific dot log files
Commands: see usage.txt file
Created Date: October 21, 2022
Authors: Kara Balsom, Glen May, Makenzie Roberts, and David Turner
------------------------------------------------------------------------*/

// NPM installed Modules
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// Node.js common core global modules
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (event, level, message) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
  if (DEBUG) console.log(logItem);
  try {
    if (level === "CONFIG_WARNING") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName =
        `${format(new Date(), "yyyyMMdd")}` + "_Config_Warnings.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    } else if (level === "CONFIG_INFO") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName = `${format(new Date(), "yyyyMMdd")}` + "_Config_Info.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    }
    if (level === "INIT_WARNING") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName =
        `${format(new Date(), "yyyyMMdd")}` + "_Init_Warnings.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    } else if (level === "INIT_INFO") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName = `${format(new Date(), "yyyyMMdd")}` + "_Init_Info.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    }
    if (level === "TOKEN_WARNING") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName =
        `${format(new Date(), "yyyyMMdd")}` + "_Token_Warnings.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    } else if (level === "TOKEN_INFO") {
      if (!fs.existsSync(path.join(__dirname, "logs"))) {
        // include ./logs/yyyy/mmmm
        await fsPromises.mkdir(path.join(__dirname, "logs"));
      }
      // Include todays date in filename
      const fileName = `${format(new Date(), "yyyyMMdd")}` + "_Token_Info.log";
      await fsPromises.appendFile(
        path.join(__dirname, "logs", fileName),
        logItem + "\n"
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;
