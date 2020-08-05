const users = require("./users")

function getUserByName(user){
    for(let i = 0; i < users.length; i++){
        if(users[i].username == user){
            return users[i];
        }
    }
    return null;
}
module.exports = {
    getUserByName
}