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
    try{
        if(req.session.userid){
            console.log(req.session.userid)
            
            // let user_projects = await projects.getProjectsByUser(req.session.userid);
            // console.log(user_projects);
            let user = await users.getUser(req.session.userid);
            let user_projects = await projects.getProjectsByUser(req.session.userid);
            let teamProjects = [];

            if(user_projects.length){
                // user_projects = await projects.getProjectsByUser(req.session.userid);
                console.log(user_projects);
            }
            let teamProjectsArr = user.participant;
            if(teamProjectsArr.length){
                teamProjects = await projects.getProjectsByArray(teamProjectsArr);
            }
            console.log(teamProjects)
            res.render("projects",{CreatedCount: user_projects.length, ParticipatedCount: teamProjectsArr.length,CreatedProjects: user_projects, TeamProjects: teamProjects });
            // return;
        }else{
            res.render("login");
        }
    }catch(error){
        res.status(500).json({ error: error });
    }
});

router.get('/:id', async (req, res) => {
    let project = await projects.getProject(req.params.id);
    let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    let totalTime = 0;
    for(task of projectTasks){ 
        let tempTime = task.timespent;
        let integerTime = parseInt(tempTime, 10);
        totalTime += integerTime
    }
    let stringTime = totalTime.toString();
    res.render('project', {Project: project, Tasks: projectTasks, Time: stringTime});

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
    let project = await projects.getProject(project_id);
    let d = new Date(deadline)

    
    if (!title || !description || !d || !teammembers){
        res.status(401).render("editProject", {error: true, Project: project, userList: user_list });
        return;
    }
    console.log(teammembers);
    const teamMembersObjectArray = teammembers.map(x => ObjectId(x));
    console.log('below')
    let newProject = await projects.updateProject(project_id,title, description, d, teamMembersObjectArray)
    res.redirect('/projects')

});
router.post('/deleteproject/:id', async (req, res) => {
    try {
        await projects.removeProject(req.params.id);
    } catch (error) {
        console.log(error)
    }
    res.redirect('/projects')
});
module.exports = router;