//  Logs events as called by an event emitter

//  Import dependencies
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

//  Import core modules
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

//  Log events with date and time
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
        `${format(new Date(), "yyyyMMdd")}` + "_configWarnings.log";
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
      const fileName = `${format(new Date(), "yyyyMMdd")}` + "_configInfo.log";
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
