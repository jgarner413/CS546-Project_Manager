const DashboardRoutes = require('./projects');
const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/dashboard', DashboardRoutes);
	app.use('/user', userRoutes);
    app.use("*", (req, res) => {
        res.redirect("/dashboard");
      });
};

module.exports = constructorMethod;