var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
let { newToken } = require("./token.js");
global.DEBUG = true;

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});

// This function retrieves the username and password from the form
const getUser = (request, response) => {
  const username = request.query.username;
  const token = newToken(username);
  console.log("(server.js) - Username Retrieved: " + username);
  response.status(200).send(token);
};

app.get("/view", getUser);

server.listen(3000, function () {
  console.log("server is listening on port: 3000");
});
