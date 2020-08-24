const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const projects = require("../data/projects")
const user_func = require("../data/user_func")
const saltRounds = 16;
const { ObjectId } = require('mongodb');

router.get("/", async (req, res) => {
    if (req.session.user) {
        console.log(req.session.userid);
        let user_list = await users.getAllUsers();
        // console.log(user_list);
        const creator = req.session.userid;
        
        for (var i = 0; i < user_list.length; i++) {
            if (user_list[i]._id == creator) {
                user_list.splice(i, 1);
                // console.log('---------------------------------')
                // console.log(i)
                break;
            }
        }
        res.render("addProjects", { userList: user_list });
        return;
    } else {
        res.render("login", { layout: false });
    }
});

router.post("/", async (req, res) => {
    let user_list = await users.getAllUsers();
    let title = req.body.title;
    let description = req.body.description;
    let deadline = req.body.deadline;
    // let duetime = req.body.duetime;
    let teammembers = req.body.teammembers;
    let d = new Date(deadline);

    console.log(title);
    console.log(description);
    console.log(d);
    console.log(teammembers);

    if (!title || !description || !d) {
        res.status(401).render("addProjects", { error: true, userList: user_list });
        return;
    }
    let teamMembersObjectArray = [];

    if (teammembers) {
        if (Array.isArray(teammembers)) {
            teamMembersObjectArray = teammembers.map(x => ObjectId(x));
        } else {
            teamMembersObjectArray.push(ObjectId(teammembers));
        }

    }
    let newProject = await projects.createProject(title, description, ObjectId(req.session.userid), d, '0', teamMembersObjectArray, []);
    await users.addCreatedProjectToUser(ObjectId(req.session.userid), newProject._id)
    if (teammembers) {
        for (x of teamMembersObjectArray) {
            await users.addPartipantProjectToUser(x, newProject._id);
        }
    }
    res.redirect("projects");
});

module.exports = router;