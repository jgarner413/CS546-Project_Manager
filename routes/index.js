const mainRoutes = require("./main");
const loginRoutes = require("./login");
const privateRoutes = require("./private");
const logoutRoutes = require("./logout")
const path = require("path");

const constructorMethod = app => {
  app.use ("/", mainRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/private", privateRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;