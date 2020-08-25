const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const tasks = require("../data/tasks")
const user_func = require("../data/user_func")
const saltRounds = 16;
const { ObjectId } = require('mongodb');

router.get("/", async (req, res) => {
    try {
        if (req.session.userid) {
            console.log(req.session.userid)

            // let user_projects = await projects.getProjectsByUser(req.session.userid);
            // console.log(user_projects);
            let user = await users.getUser(req.session.userid);
            let user_projects = [];
            let teamProjects = [];
            let userProjectArr = user.created;

            if (userProjectArr.length) {
                // user_projects = await projects.getProjectsByUser(req.session.userid);
                // console.log(user_projects);
                user_projects = await projects.getProjectsByUser(req.session.userid);
            }
            let teamProjectsArr = user.participant;
            if (teamProjectsArr.length) {
                teamProjects = await projects.getProjectsByArray(teamProjectsArr);
            }
            // console.log(teamProjects)
            res.render("projects", { CreatedCount: userProjectArr.length, ParticipatedCount: teamProjectsArr.length, CreatedProjects: user_projects, TeamProjects: teamProjects });
            // return;
        } else {
            res.render("login");
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/:id', async (req, res) => {
    let project = await projects.getProject(req.params.id);
    let project_members = project.members
    let name_list = []
    let taskTime = [];
    for (id of project_members) {
        let member = await users.getUser(id)
        let full_Name = " " + member.firstName + " " + member.lastName;
        name_list.push(full_Name);
    }
    let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    let creator = await users.getUser(project.creator);
    let allTasks = project.tasks;
    for (id of allTasks) {
        let task = await tasks.getTask(id);
        taskTime.push(task.timespent);
    }
    // let totalTime = project.time;
    // for(task of projectTasks){ 
    //     let tempTime = task.timespent;
    //     let integerTime = parseInt(tempTime, 10);
    //     totalTime += integerTime
    // }
    // let stringTime = totalTime.toString();
    // let second = project.time%60;
    // let minute = project.time%3600;
    // let hour = Math.floor(project.time/3600);
    res.render('project', { Project: project, Tasks: projectTasks, taskTime: taskTime, Creator: creator, TeamMembers: name_list });

});

router.get('/edit/:id', async (req, res) => {
    console.log(req.params.id);
    // let user_list = await users.getAllUsers();
    let project = await projects.getProject(req.params.id);
    let user_list = await users.getAllUsers();
    // console.log(user_list);
    const creator = project.creator;

    for (var i = 0; i < user_list.length; i++) {

        if (user_list[i]._id.equals(creator)) {
            user_list.splice(i, 1);
            break;
        }
    }
    if (creator != req.session.userid) {
        var index = user_list.findIndex(p => p._id.equals(req.session.userid));
        console.log(index)
        user_list.splice(index, 1);
    }
    //let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    res.render('editProject', { Project: project, userList: user_list });

});

router.post('/editProject', async (req, res) => {
    try {
        console.log('here')
        let user_list = await users.getAllUsers();
        let title = req.body.title;
        let description = req.body.description
        let deadline = req.body.deadline
        let teammembers = req.body.teammembers
        let project_id = req.body.projectid
        let project = await projects.getProject(project_id);
        // let duetime = req.body.duetime;
        let d = new Date(deadline);


        // if (!title || !description || !d || !teammembers){
        //     res.status(401).render("editProject", {error: true, Project: project, userList: user_list });
        //     return;
        // }
        if (!title || !description || !d) {
            res.status(401).render("editProject", { error: true, Project: project, userList: user_list });
            return;
        }
        // console.log(teammembers);
        let teamMembersObjectArray = [];
        if (!project.creator.equals(req.session.userid)) {
            teamMembersObjectArray.push(ObjectId(req.session.userid))
        }
        // if (Array.isArray(teammembers)) {
        //     teamMembersObjectArray = teammembers.map(x => ObjectId(x));
        // } else {
        //     teamMembersObjectArray.push(ObjectId(teammembers));
        // }
        if (Array.isArray(teammembers)) {
            for (var i = 0; i < teammembers.length; i++) {
                teamMembersObjectArray.push(ObjectId(teammembers[i]))
            }
        } else if(teammembers) {
            teamMembersObjectArray.push(ObjectId(teammembers))
        }
        // const teamMembersObjectArray = teammembers.map(x => ObjectId(x));
        console.log('below')
        let newProject = await projects.updateProject(project_id, title, description, d, teamMembersObjectArray)
        res.redirect('/projects')
    }catch(error){
        res.status(500).redirect('/projects');
    }

});
router.get('/leaveproject/:id', async (req, res) => {
    try {
        let project = await projects.getProject(req.params.id);
        let user_list = project.members
        for (var i = 0; i < user_list.length; i++) {
            console.log('start!!!')
            if (user_list[i].equals(req.session.userid)) {
                user_list.splice(i, 1);
                console.log('found it!!!')
                break;
            }
        }
        let teamMembersObjectArray = [];
        for (var i = 0; i < user_list.length; i++) {
            teamMembersObjectArray.push(ObjectId(user_list[i]));
        }
        console.log(teamMembersObjectArray)
        await projects.updateMembers(req.params.id, teamMembersObjectArray)
        res.redirect('/projects');
    } catch (error) {
        res.status(304).redirect('/projects');
    }
});
router.post('/deleteproject/:id', async (req, res) => {
    try {
        await projects.removeProject(req.params.id);
        res.redirect('/projects');
    } catch (error) {
        console.log(error)
        res.status(500).redirect('/projects');
    }
    // res.redirect('/projects')
});
module.exports = router;