const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const user_func = require("../data/user_func")
const saltRounds = 16;
const { ObjectId } = require('mongodb');

router.get("/",async (req,res) => {
    console.log(req.session.user);
    if(req.session.user){
        let user_list = await users.getAllUsers();
        console.log(user_list);
        res.render("addProjects",{userList: user_list});
        return;
    }
    res.render("login");
});

router.post("/", async (req, res) => {
    let user_list = await users.getAllUsers();
    let title = req.body.title;
    let description = req.body.description
    let deadline = req.body.deadline
    let teammembers = req.body.teammembers
    let d = new Date(deadline)
    
    console.log(title);
    console.log(description);
    console.log(d);
    console.log(teammembers);
    const teamMembersObjectArray = teammembers.map(x => ObjectId(x));
    if (!title || !description || !d || !teammembers){
        res.status(401).render("addProjects", {error: true, userList: user_list });
        return;
    }
    let newProject = await projects.createProject(title,description,ObjectId(req.session.userid), d, '0', teamMembersObjectArray, []);
    for(x of teamMembersObjectArray){
        await users.addPartipantProjectToUser(x,newProject._id);
    }
    res.redirect('projects');
});

module.exports = router;