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
    try{
        console.log("HERE!!!")
        let user_list = await users.getAllUsers();
        let project = await projects.getProject(req.params.id);
        console.log(user_list);
        res.render("addTask",{Project: project, userList: user_list});
    }catch(error){
        console.log(error);
    }
});

router.post("/addtask", async (req, res) => {
    let user_list = await users.getAllUsers();
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

router.get('/edit/:id', async (req, res) => {
    console.log(req.params.id);
    let user_list = await users.getAllUsers();
    let task = await tasks.getTask(req.params.id);
    //let projectTasks = await tasks.getTaskByProjectID(req.params.id);
    res.render('editTask', {Task: task, userList: user_list});

});

router.post('/editTask', async (req, res) => {
    console.log('here')
    let user_list = await users.getAllUsers();
    let title = req.body.title;
    let taskid = req.body.taskid;
    let timespent = req.body.timespent
    let deadline = req.body.deadline;
    let assignedTo = req.body.assignedTo;
    let d = new Date(deadline)
    assignedTo = ObjectId(assignedTo);
    let task = await tasks.getTask(taskid);
    if (!title || !deadline || !d || !assignedTo){
        res.status(401).render("editTask", {error: true, Task: task, userList: user_list });
        return;
    }
    
    let newProject = await tasks.updateTask(taskid, title, timespent, d, assignedTo)
    res.redirect("/projects/" + task.project_id);

});

router.post('/updateTime', async (req, res) => {
    let taskid = req.body.taskid;
    let newTime = req.body.newtime; 
    let projectid = req.body.projectid;
    // console.log(newTime);
    // console.log(taskid);
    //let projectid = req.body.projectid;
    // let task = await tasks.getTask(taskid);
    const taskTime = await tasks.updateTime(taskid,newTime);
    await projects.updateTime(projectid,taskTime);
    res.redirect("/projects/" + projectid);

});

router.post('/deletetask/:id', async (req, res) => {
    try {
        var task = await tasks.getTask(req.params.id)
        await tasks.removeTask(req.params.id);
    } catch (error) {
        console.log(error)
    }
    res.redirect("/projects/" + task.project_id);
});

router.get('/start/:id', async (req, res) => {
    try{
        const task = await tasks.getTask(req.params.id);
        const project = await projects.getProject(task.project_id);
        res.render('task',{task:task, project:project});
    }catch(error){
        console.log(error);
        res.redirect("/projects/" + task.project_id);
    };
})

// router.get('/stop/:id', async (req, res) => {
//     try{
//         const task = await tasks.getTask(req.params.id);
//         const project = task.project_id;
//         res.render('task',{task:task});
//     }catch(error){
//         console.log(error);
//         res.redirect("/projects/" + task.project_id);
//     };
// })

module.exports = router;