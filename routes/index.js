const loginRoutes = require("./login");
const profileRoutes = require("./profile");
const logoutRoutes = require("./logout")
const registerRoutes = require("./register")
const projectRoutes = require("./projects")
const path = require("path");

const constructorMethod = app => {
  app.use("/register", registerRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/profile", profileRoutes);
  app.use("/projects", projectRoutes);

  app.use("*", (req, res) => {
    res.redirect("/profile");
  });
};

module.exports = constructorMethod;