const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const tasks = require("../data/tasks")
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

router.get('/:id', async (req, res) => {
    let project = await projects.getProject(req.params.id);
    let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    res.render('project', {Project: project, Tasks: projectTasks});

});
module.exports = router;