/*----------------------------------------------------------------------
File Name: server.js
Purpose: Allows a access/path to a server with a user interface
Commands: see usage.txt file
Created Date: October 21, 2022
Authors: Kara Balsom, Glen May, Makenzie Roberts, and David Turner
------------------------------------------------------------------------*/

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const {
  tokenCount,
  newToken,
  expiryCheck,
  existCheck,
  arr,
  fetchRecord,
  searchRecord,
} = require("./token.js");

const server = http.createServer(app);
global.DEBUG = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});

// This function retrieves the username and password from the form
const getUser = async (req, res) => {
  const username = req.query.username;
  let result = await existCheck(username);
  console.log(`Check test result: ${result}`);

  if (result[0] == false) {
    const token = await newToken(username);
    console.log("(server.js) - Username Retrieved: " + username);
    res.status(200).send(`Your token is: ${token}`);
  } else {
    const token = result[1].token;
    res.status(200).send(`Your token is: ${token}`);
  }
};

const getRecord = async (req, res) => {
  const username = req.query.username;
  let result = await existCheck(username);
  console.log(`Check test result: ${result}`);

  if (result[0] == false) {
    console.log("(server.js) - Username NOT RETRIEVED: " + username);
    res.status(200).send(`No record found`);
  } else {
    const data = await fetchRecord(username);
    console.log(data);
    res.status(200).send(`The Record is: ${data}`);
  }
};

const getToken = async (req, res) => {
  const username = req.query.username;
  let result = await existCheck(username);
  console.log(`Check test result: ${result}`);

  if (result[0] == false) {
    const token = await searchRecord(username);
    console.log("(server.js) - Username Retrieved: " + username);
    res.status(200).send(`Your token is: ${token}`);
  } else {
    const token = result[1].token;
    res.status(200).send(`Your token is: ${token}`);
  }
};

app.get("/view", getUser);
app.get("/fetch", getRecord);
app.get("/token", getToken);

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
