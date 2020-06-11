const express = require("express");
const router = express.Router();

//Welcome
router.get("/", function (req, res) {
  res.render("welcome");
});

module.exports = router;
