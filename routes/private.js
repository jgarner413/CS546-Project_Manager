const express = require("express");
const router = express.Router();

const users = require("../data/users")
const user_func = require("../data/user_func")

router.get("/",async (req,res) => {

    let user = await users.getUserByName(req.session.user)

    res.render("private",user);
});


module.exports = router;