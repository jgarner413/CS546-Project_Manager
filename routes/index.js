const loginRoutes = require("./login");
const privateRoutes = require("./private");
const logoutRoutes = require("./logout")
const registerRoutes = require("./register")
const path = require("path");

const constructorMethod = app => {
  app.use("/register", registerRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/private", privateRoutes);

  app.use("*", (req, res) => {
    res.redirect("/private");
  });
};

module.exports = constructorMethod;