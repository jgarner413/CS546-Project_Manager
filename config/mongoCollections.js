const dbConnection = require("./mongoConnection");

const getCollectionFn = collection => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    users: getCollectionFn("users"),
<<<<<<< HEAD
    projects: getCollectionFn("projects"),
    tasks: getCollectionFn("taks")
=======
    projects: getCollectionFn("projects")
>>>>>>> 6f9fdaac8a5467fe9cf7076d7982de960f857579
};