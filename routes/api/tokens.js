const express = require("express");
const router = express.Router();
const tokenController = require("../../controllers/tokenController");

router
  .route("/")
  .post(tokenController.createUser)
  .get(tokenController.fetchRecord)
  .get(tokenController.getToken)

module.exports = router;