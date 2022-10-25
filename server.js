const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const { newToken, expiryCheck, existCheck } = require("./token.js");

const server = http.createServer(app);
global.DEBUG = true;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});

// This function retrieves the username and password from the form
const getUser = (request, response) => {
  const username = request.query.username;
  let result = existCheck(username);
  console.log(`Check test result: ${result}`)
  // if (result === false ){
    const token = newToken(username);
    console.log("(server.js) - Username Retrieved: " + username);
    response.status(200).send(token);
  // }else{
  //   const token = result;
  //   response.status(200).send(token)
  // }
;}

app.get("/view", getUser);

server.listen(PORT, ()=>{
  console.log(`Server is listening on port: ${PORT}`);
});
