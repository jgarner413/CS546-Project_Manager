const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

module.exports = {
    async addUser(firstName, lastName, email, passwordHash, username, description, created=[], participant=[]) {
    if(!firstName || typeof firstName!= 'string') throw 'you must provide a valid first name';
    if(!lastName || typeof lastName!= 'string') throw 'you must provide a valid last name';
    if(!email || typeof email!= 'string') throw 'you must provide a valid email';
    if(!passwordHash || typeof passwordHash!= 'string') throw 'you must provide a valid password hash';
    if(!username || typeof username!= 'string') throw 'you must provide a valid username';
    if(!description || typeof description!='string') throw 'you must provide a valid description';

        const usersCollection = await users();
        let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        passwordHash: passwordHash,
        username: username,
        description: description,
        created: created,
        participant: participant
        };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
        const newId = insertInfo.insertedId;
        return await this.getUser(newId);
},
};