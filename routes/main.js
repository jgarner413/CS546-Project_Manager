const express = require("express");
const user_func = require("../data/user_func")
const users = require("../data/users")
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.session.loggedIn) {

    res.redirect("/private");
  } else{

    res.render("login");

  }
});

module.exports = router;