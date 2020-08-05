const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const user_func = require("../data/user_func")

router.post("/", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){
        res.status(401).render("login", {error:true});
        return;
    }
    let user = await users.getUserByName(username)
    if(user){
        let samePassword = bcrypt.compare(password,user["passwordHash"]);
        if(samePassword){

            req.session.loggedIn = true;
            req.session.user = user.username;
            
            res.redirect("/private");
        } else{
            res.status(401).render("login", {error:true});
        }
    } else{

        res.status(401).render("login", {error:true});
    }

});


module.exports = router;