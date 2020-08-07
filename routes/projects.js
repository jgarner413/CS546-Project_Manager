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
        res.render("projects",{CreatedProjects: user_projects});
        return;
    }
    res.render("login");
});

module.exports = router;