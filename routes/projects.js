const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const tasks = require("../data/tasks")
const user_func = require("../data/user_func")
const saltRounds = 16;
const { ObjectId } = require('mongodb');

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

router.get('/edit/:id', async (req, res) => {
    console.log(req.params.id);
    let user_list = await users.getAllUsers();
    let project = await projects.getProject(req.params.id);
    //let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    res.render('editProject', {Project: project, userList: user_list});

});

router.post('/editProject', async (req, res) => {
    console.log('here')
    let user_list = await users.getAllUsers();
    let title = req.body.title;
    let description = req.body.description
    let deadline = req.body.deadline
    let teammembers = req.body.teammembers
    let project_id = req.body.projectid
    let d = new Date(deadline)

    const teamMembersObjectArray = teammembers.map(x => ObjectId(x));
    if (!title || !description || !d || !teammembers){
        res.status(401).render("editProject", {error: true, userList: user_list });
        return;
    }
    console.log('below')
    let newProject = await projects.updateProject(project_id,title, description, d, teamMembersObjectArray)
    res.redirect('/projects')

});
module.exports = router;