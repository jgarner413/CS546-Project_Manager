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


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


let directToSignIn = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    }
    else{
        res.redirect("login");
    }
};

app.use("/profile", directToSignIn);

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
