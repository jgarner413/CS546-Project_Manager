const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = require('./users');
const { ObjectId } = require('mongodb');
const xss = require('xss');

module.exports = {
    async createProject(title, description, creator, deadline, time,  members=[], tasks=[]) {
        if(!title || typeof title!= 'string') throw 'you must provide a valid title';
        if(!description || typeof description!= 'string') throw 'you must provide a valid description';
        if(!creator) throw 'you must provide a valid creator id';
        if(!time || typeof time!= 'string') throw 'you must provide a valid time';
        //if(!deadline || typeof deadline != 'Date') throw 'you must provide a valid time';
        //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); true
        //may need moment.js package

        const projectsCollection = await projects();
        let newProject = {
            title: xss(title),
            description: xss(description),
            creator: creator,
            members: members,
            deadline: deadline,
            time: xss(time),
            tasks: tasks
        }
        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';
        // const addToCreator = await users.addCreatedProjectToUser(insertInfo.creator, insertInfo.insertedId);
        // members.forEach(element => await users.addPartipantProjectToUser(element,insertInfo.insertedId))
        const newId = insertInfo.insertedId; 
        return await this.getProject(newId);
    },

    async getAllProjects() {
        const projectsCollection = await projects();
        return projectsCollection.find({}).toArray();
    },

    async getProject(id) {
        if (!id) throw 'You must provide a user id to search for';

        const objId = ObjectId(id);
        const projectsCollection = await projects();
        const project = await projectsCollection.findOne({ _id: objId });
        if (project === null) throw 'No user with this id';

        return project;
    },
    async getProjectsByUser(userId) {
        if (!userId) throw 'You must provide a user id to search for';

        const objId = ObjectId(userId);
        const projectsCollection = await projects();
        const userProjects = await projectsCollection.find({ creator: objId }).toArray();
        return userProjects;
    },

    async updateProject(projectId, title, description, deadline, teammembers) {

        if (!projectId) throw 'You must provide a project id to update';
        if (!title) throw 'You must provide a title for your project';
        if (!description) throw 'You must provide a description for your project';
        if (!deadline) throw 'You must provide a deadline for your project';
        if (!teammembers) throw 'You must provide a deadline for your project';



        const objId = ObjectId(projectId);
        const projectsCollection = await projects();
        const updatedInfo = await projectsCollection.updateOne({ _id: objId }, { $set: {title: xss(title), description: xss(description),
            deadline: deadline, members: teammembers}});
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update project successfully';
        }

        return await this.getProject(projectId);
    },

    async getProjectsByArray(projectArray){
        if (!projectArray) throw 'You must provide a list of project ids';
        const projectsCollection = await projects();
        const projectObjectArray = projectArray.map(x => ObjectId(x));
        console.log(projectObjectArray);
        const userProjects = await projectsCollection.find({"_id" : {"$in" : projectObjectArray }}).toArray();
        return userProjects;
    },
    async removeProject(id) {
        const projectCollection = await projects();
        const objId = ObjectId(id);
        const deletionInfo = await projectCollection.deleteOne({ _id: objId });
        if (deletionInfo.deletedCount === 0)
          throw `Could not delete project with id of ${id}`;
        return true;
      },
};