const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const tasks = require("../data/tasks")
const user_func = require("../data/user_func")
const saltRounds = 16;
const { ObjectId } = require('mongodb');

router.get("/:id",async (req,res) => {
    console.log("HERE!!!")
    let user_list = await users.getAllUsers();
    let project = await projects.getProject(req.params.id);
    console.log(user_list);
    res.render("addTask",{Project: project, userList: user_list});
});

router.post("/addtask", async (req, res) => {
    let title = req.body.title;
    let projectid = req.body.projectid;
    let deadline = req.body.deadline;
    let assignedTo = req.body.assignedTo;
    let d = new Date(deadline);
    if (!title || !projectid || !d || !assignedTo){
        res.status(401).render("addProjects", {error: true, userList: user_list });
        return;
    }
    let newTask = await tasks.createTask(title,projectid, deadline, "0", assignedTo);
    res.redirect("/projects/" + projectid);
});
router.post("/edittask", async (req, res) => {

});

module.exports = router;