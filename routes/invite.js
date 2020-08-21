const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

router.get("/",async (req,res) => {
    res.render("invite");
});
router.post("/", async (req, res) =>{
    let name = req.body.name;
    let email = req.body.email;

    if(!name || !email){
        res.status(401).render("invite", {Response: "Please fill in both fields"});
        return;
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'projectmanagercs546@gmail.com',
          pass: '00*l70wrqSkEURol'
        }
      });

      var mailOptions = {
        from: 'projectmanagercs546@gmail.com',
        to: email,
        subject: 'Project Manager Invite',
        text: 'Hi ' + name + ",you have been invited to join our CS546 Project Manager project! You can register at localhost:3000/register"
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          alert(error)
          res.status(401).render("invite", {Response: "Email failed to send"});
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).render("invite", {Response: "Email sent successfully"});
        }
      });
});
module.exports = router;
