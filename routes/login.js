const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users");
const user_func = require("../data/user_func");

router.get("/",async (req,res) => {
    if(req.session.user){
        res.redirect("/profile");
        return;
    }
    res.render("login", { layout: false });
});


router.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){
        res.status(401).render("login", {error:true, layout: false });
        return;
    }
    let user = await users.getUserByName(username)
    console.log(user)
    if(user){
        let samePassword = bcrypt.compare(password,user["passwordHash"]);
        if(samePassword){

            req.session.loggedIn = true;
            req.session.user = user.username;
            req.session.userid = user._id;
            
            res.redirect("/profile");
        } else{
            res.status(401).render("login", {error:true,  layout: false });
        }
    } else{

        res.status(401).render("login", {error:true,  layout: false });
    }

});


module.exports = router;