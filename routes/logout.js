const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

    req.session.destroy(function(err){
        if(err){
            throw err;
        }   
    });
    res.render("logout")
});

module.exports = router;