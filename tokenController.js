// These controllers route the web request to use the same functions employed by the command line interface, keeping our code DRY.
// Note they return JSON format, should we choose to style our responses this will make it easier to have modular components.

const { newToken, getRecord, searchToken } = require("./token.js");

// Handles new user requests.
const createUser = async (req, res) => {
  const username = req.body.username; // NOTE: Data extracted from request body when using POST
  const result = await newToken(username);
  res.status(201).json(result);
};

// Handles user record requests
const fetchRecord = async (req, res) => {
  const username = req.query.username;
  const result = await getRecord(username);
  res.status(200).json(result);
};

// Handles existing token queries
const getToken = async (req, res) => {
  const username = req.query.username;
  const result = await searchToken(username);
  res.status(200).json(result);
};

module.exports = {
  createUser,
  getToken,
  fetchRecord,
};
