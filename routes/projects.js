const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const user_func = require("../data/user_func")
const saltRounds = 16;


router.get("/",async (req,res) => {
    if(req.session.user){
        console.log(req.session.userid)
        let user_projects = await projects.getProjectsByUser(req.session.userid);
        console.log(user_projects);
        let user = await users.getUser(req.session.userid);
        let teamProjectsArr = user.participant;
        let teamProjects = await projects.getProjectsByArray(teamProjectsArr);
        console.log(teamProjects)
        res.render("projects",{CreatedProjects: user_projects, TeamProjects: teamProjects });
        return;
    }
    res.render("login");
});

module.exports = router;