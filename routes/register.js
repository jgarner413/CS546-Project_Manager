const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require("../data/users")
const user_func = require("../data/user_func")
const saltRounds = 16;


router.get("/",async (req,res) => {
    if(req.session.user){
        res.redirect("/profile");
        return;
    }
    res.render("register");
});

router.post("/", async (req, res) => {

    let username = req.body.username;
    let email = req.body.email
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let password = req.body.password;
    let description = req.body.description
    console.log(username);
    console.log(email);
    console.log(firstName);
    console.log(lastName);
    console.log(password);
    console.log(description);

    if (!username || !password || !email || !firstName || !lastName || !description){
        res.status(401).render("login", {error:true});
        return;
    }
    let password_hash = await bcrypt.hash(password, saltRounds);
    let user_db = await users.addUser(firstName, lastName, email, password_hash, username, description, [], []);
    console.log(user_db);
    let user = await users.getUserByName(username)
    if(user){
        let samePassword = bcrypt.compare(password,user["passwordHash"]);
        if(samePassword){

            req.session.loggedIn = true;
            req.session.user = user.username;
            
            res.redirect("/profile");
        } else{
            res.status(401).render("login", {error:true});
        }
    } else{

        res.status(401).render("login", {error:true});
    }

});

module.exports = router;