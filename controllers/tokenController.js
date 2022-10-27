const { compareDesc } = require("date-fns");
const {
  newToken,
  getRecord,
  searchToken,
} = require("../token.js");

const data = {
  ads: require("../json/tokens.json"),
  setAds: function (data) {
    this.ads = data;
  },
};


//  Creates a new user 
const createUser = async (req, res) => {
    const username = req.body.username;
    const result = await newToken(username)
    res.status(200).send(result);
  };

// Returns existing user data
const fetchRecord = async (req, res) => {
  const username = req.query.username;
  const result = await getRecord(username);
  res.status(200).send(result); 
};

// Returns a token for supplied username
const getToken = async (req, res) => {
  const username = req.query.username;
  const result =  await searchToken(username)
    res.status(200).json(result);
};

module.exports = {
  createUser,
  getToken,
  fetchRecord,
};
