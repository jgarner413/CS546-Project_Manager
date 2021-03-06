const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    hour: (sec) => {
			return Math.floor(sec/3600);
    },
    minute: (sec) => {
			return Math.floor((sec%3600)/60);
    },
    second: (sec) => {
			return sec%60;
    },
  },
  partialsDir: [ 'views/' ]
});
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
// var hbs = exphbs.create({});


let directToSignIn = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    }
    else{
        res.render("login",{ layout: false });
    }
};

app.use("/profile", directToSignIn);
app.use("/projects", directToSignIn);


app.use(async (req, res, next) => {
  console.log("___________________________");
  let currentTime = new Date().toUTCString();
  console.log(currentTime);
  console.log(req.originalUrl)
  console.log(req.method);
  if(req.session.user){
    console.log("Authenticated User");
  } else {
    console.log("Non-Authenticated User");
  }
  console.log("___________________________");
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
