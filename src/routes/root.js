const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Glimmy API Running");
});

module.exports = router;
