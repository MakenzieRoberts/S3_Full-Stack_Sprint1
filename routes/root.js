const express = require('express');
const router = express.Router();
const path = require('path');

router.get("^/$|/server(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views/web','form.html'));
});


module.exports = router;