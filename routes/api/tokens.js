const express = require("express");
const router = express.Router();
const tokenController = require("../../controllers/tokenController");

router
  .route("/")
  .post(tokenController.createUser)
;

router
  .route("/fetch")
  .get(tokenController.fetchRecord)
;

router
  .route("/tokens")
  .get(tokenController.getToken)
module.exports = router;