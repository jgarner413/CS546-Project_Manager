const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const xss = require('xss');

module.exports = {
    async addUser(firstName, lastName, email, passwordHash, username, description) {
        if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
        if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
        if(!email || typeof email!= 'string') throw 'you must provide a valid email';
        if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';
        if(!username || typeof username!= 'string') throw 'you must provide a valid username';
        if(!description || typeof description!='string') throw 'you must provide a valid description';

        const usersCollection = await users();
        let newUser = {
        firstName: xss(firstName),
        lastName: xss(lastName),
        email: xss(email),
        passwordHash: xss(passwordHash),
        username: xss(username),
        description: xss(description),
        created: [],
        participant: []
        };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        return await this.getUser(newId);
    },
    async getAllUsers() {
        const usersCollection = await users();
        return usersCollection.find({}).toArray();
    },

    async getUser(id) {
        if (!id) throw 'You must provide a user id to search for';

        const objId = ObjectId(id);
        const usersCollection = await users();
        const user = await usersCollection.findOne({ _id: objId });
        if (user === null) throw `No user with this id ${id}`;

        return user;
    },
    async getUserByName(name) {
        if (!name) throw 'You must provide a user id to search for';
        const usersCollection = await users();
        const user = await usersCollection.findOne({ username: name });
        if (user === null) throw 'No user with this name';

        return user;
    },

    async updateUser(id , updatedUser) {
        const usersCollection = await users();
    
        const updatedUserData = {};
    
        if (updatedUser.firstName) {
          updatedUserData.firstName = updatedUser.firstName;
        }
    
        if (updatedUser.lastName) {
          updatedUserData.lastName = updatedUser.lastName;
        }
    
        if (updatedUser.email) {
          updatedUserData.email = updatedUser.email;
        }

        if (updatedUser.passwordHash){
            updatedUserData.passwordHash = updatedUser.passwordHash;
        }
    
        if (updatedUser.username){
            updatedUserData.username = updatedUser.username;
        }
    
        if (updatedUser.description){
            updatedUserData.description = updatedUser.description;
        }
    
        let updateCommand = {
          $set: updatedUserData
        };
        const query = {
          _id: id
        };
        await usersCollection.updateOne(query, updateCommand);
    
        return await this.getUser(id);
    },

    async addCreatedProjectToUser(userId, projectId){
        if(!userId) throw 'You must provide a user id';
        if(!projectId) throw 'You must provide a project Id';

        const usersCollection = await users();
        if(typeof(userId) === 'string')
            userId = ObjectId(userId);
        const updateInfo = await usersCollection.updateOne({_id: userId}, {$push: {created: xss(projectId)}});
        if (updateInfo.modifiedCount === 0)
            throw 'Could not add the project to the user';

        return true;
    },

    async addPartipantProjectToUser(userId, projectId){
        if(!userId) throw 'You must provide a user id';
        if(!projectId) throw 'You must provide a project Id';

        projectId = projectId.toString();
        if(typeof(userId) === 'string')
            userId = ObjectId(userId);
        //if(typeof(projectId) === 'string')
            //projectId = ObjectId(projectId);

        const usersCollection = await users();
        const updateInfo = await usersCollection.updateOne({_id: userId},{$push: {participant: xss(projectId)}});
        if (updateInfo.modifiedCount === 0)
            throw 'Could not add the project to the user';

        return true;
    },


};