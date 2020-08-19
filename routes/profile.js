const express = require("express");
const router = express.Router();

const users = require("../data/users")
const tasks = require("../data/tasks")
const user_func = require("../data/user_func")

router.get("/",async (req,res) => {

    let user = await users.getUserByName(req.session.user);
    console.log(user)
    let user_tasks = await tasks.getTasksByUser(user._id);
    console.log(tasks)
    console.log(user_tasks);

    res.render("profile",{User: user, CreatedCount: user_tasks.length, Tasks: user_tasks});
});


module.exports = router;