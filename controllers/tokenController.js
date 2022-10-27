const { compareDesc } = require("date-fns");
const {
  newToken,
  existCheck,
  getRecord,
  searchToken,
} = require("../token.js");


//  Creates a new user 
const createUser = async (req, res) => {
    const username = req.query.username;
    const result = newToken(username)
    if (result[0] == false) {
      const token = await newToken(username);
      console.log("(server.js) - Username Retrieved: " + username);
      res.status(200).send(`Your token is: ${token}`);
    } else {
      const token = result[1].token;
      res.status(200).send(`Your token is: ${token}`);
    }
  };

// Returns existing user data
const fetchRecord = async (req, res) => {
  const username = req.query.username;
  const result = await getRecord(username);
  record = result
  res.status(200).send(record); 
};

// Returns a token for supplied username
const getToken = async (req, res) => {
  const username = req.query.username;
  const result =  searchToken(username)
  if (!result[1]) { // First index is always boolean
    console.log("Token does not exist.")
  } else {
    const token = result[1].token; // Second index contains object if user already exists
    console.log(`Token already exists: ${token}`)
    res.status(200).send(`Your token is: ${token}`);
  }
};

module.exports = {
  createUser,
  getToken,
  fetchRecord,
};
