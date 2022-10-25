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
const getUser = async(req, res) => {
  const username = req.query.username;
   let response = await existCheck(username)
    // console.log(` Type of: ${typeof response}`);
    // console.log(`Check test result: ${response}`)
    //   if (response === false ){
    //     const token = newToken(username);
    //     console.log("(server.js) - Username Retrieved: " + username);
    //     res.status(200).send(token);
    //   }else{
        const token = response;
        res.status(200).send(token)
      // }
  }
  


app.get("/view", getUser);

server.listen(PORT, ()=>{
  console.log(`Server is listening on port: ${PORT}`);
});
