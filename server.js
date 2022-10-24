var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "./public/form.html"));
});

// This function retrieves the username and password from the form
const getUsername = (request, response) => {
	const username = request.query.username;
	const password = request.query.password;
	console.log("(server.js) - Username Retrieved: " + username);
	console.log("(server.js) - Password Retrieved: " + password);

	// !KENZI: This next line actually does display the new token on the page, but there's
	// some strangeness going on in tokens.js For me, the token is displayed on the page,
	// but the token is not actually saved to the tokens.json file... instead, it writes
	// "utf-8" to the file, lol.

	// response.status(200).send(`Results: ${JSON.stringify(newToken(username))}`);
};

// !KENZI: We can change /view/ to whatever word we want, just keeping it here for now.
app.get("/view/", getUsername);

server.listen(3000, function () {
	console.log("server is listening on port: 3000");
});
