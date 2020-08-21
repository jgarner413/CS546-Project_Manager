var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'projectmanagercs546@gmail.com',
    pass: '00*l70wrqSkEURol'
  }
});

var mailOptions = {
  from: 'projectmanagercs546@gmail.com',
  to: 'jgarner413@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});