//  Create server and import required modules
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500; // Default to port 3500 if not specified by environment
const tokenController = require("./controllers/tokenController");
//  Set to true for robust console logging and debugging
global.DEBUG = false;

// Handle formdata
app.use(express.urlencoded({ extended: false }));
// Handle JSON
app.use(express.json());
// Manage static files like CSS and images
app.use("/", express.static(path.join(__dirname, "/public")));

//  Routing
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});
app.post("/user", tokenController.createUser); // POST: new user
app.get("/fetch", tokenController.fetchRecord); //  GET: user record
app.get("/token", tokenController.getToken); //  GET: user token

// 404 handling
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views/web", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
