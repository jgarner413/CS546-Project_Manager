const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const user = mongoCollections.users;
const users = require('./users');
const { ObjectId } = require('mongodb');
const xss = require('xss');

module.exports = {
    async createProject(title, description, creator, deadline, time, members = [], tasks = []) {
        if (!title || typeof title != 'string') throw 'you must provide a valid title';
        if (!description || typeof description != 'string') throw 'you must provide a valid description';
        if (!creator) throw 'you must provide a valid creator id';
        //if(!time || typeof time!= 'string') throw 'you must provide a valid time';
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
            time: 0,
            tasks: []
        }
        const insertInfo = await projectsCollection.insertOne(newProject);
        if (insertInfo.insertedCount === 0) throw 'Could not add project';
        // const addToCreator = await users.addCreatedProjectToUser(insertInfo.creator, insertInfo.insertedId);
        // members.forEach(element => await users.addPartipantProjectToUser(element,insertInfo.insertedId))
        const newId = insertInfo.insertedId;
        // await users.addCreatedProjectToUser(creator,newId);
        // for(let i = 0; i < members.length; i++){
        //     await users.addPartipantProjectToUser(members[i],newId);
        // }
        return await this.getProject(newId);
    },

    async getAllProjects() {
        const projectsCollection = await projects();
        return projectsCollection.find({}).toArray();
    },

    async getProject(id) {
        if (!id) throw 'You must provide a project id to search for';

        let objId = id;
        if (typeof id == 'string') {
            objId = ObjectId(id);
        }
        const projectsCollection = await projects();
        const project = await projectsCollection.findOne({ _id: objId });
        if (project === null) throw `No project with this id ${id}`;

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
        // if (!teammembers) throw 'You must provide a deadline for your project';

        const original = await this.getProject(projectId);
        const originalMembers = original.members;

        const objId = ObjectId(projectId);
        const projectsCollection = await projects();
        updatedInfo = await projectsCollection.updateOne({ _id: objId }, {
            $set: {
                title: xss(title), description: xss(description),
                deadline: deadline, members: teammembers
            }
        });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update project successfully';
        }

        await this.updateMembers(projectId, teammembers,originalMembers)

        return await this.getProject(projectId);
    },
    async updateMembers(id, teammembers ,originalMembers) {
        let removedMembers = [];
        let addMembers = [];
        console.log(teammembers);
        console.log('---------------------------------')
        if (!teammembers.length) {
            removedMembers = originalMembers;
        } else {
            var index;
            for (let i = 0; i < originalMembers.length; i++) {
                index = teammembers.findIndex(p => JSON.stringify(p) === JSON.stringify(originalMembers[i]));
                if (index < 0) {
                    console.log(originalMembers[i])
                    removedMembers.push(originalMembers[i]);
                }else{
                    teammembers.splice(index, 1);
                }
            }
            addMembers = teammembers;
        }
        const usersCollection = await user();
        let updatedInfo;
        if(addMembers.length){
            for(var i = 0; i < addMembers.length; i++){
                updatedInfo = await users.addPartipantProjectToUser(addMembers[i],id);
            }
        }
        if(removedMembers.length){
            for (let i = 0; i < removedMembers.length; i++) {
                updatedInfo = await usersCollection.updateOne({ _id: removedMembers[i] }, { $pull: { participant: id } });
                if (updatedInfo.modifiedCount === 0) {
                    throw 'Could not remove members';
                }
            }
        }
    },
    async updateTime(id, newTime) {
        let project_id = ObjectId(id);
        const projectsCollection = await projects();
        const project = await this.getProject(project_id);
        const parsedNewTime = newTime.split(':');
        const newTimeSpent = parseInt(project.time) + parseInt(parsedNewTime[0]) * 3600 + parseInt(parsedNewTime[1]) * 60 + parseInt(parsedNewTime[2]);
        const updatedInfo = await projectsCollection.updateOne({ _id: project_id }, { $set: { time: xss(newTimeSpent) } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Update time failed';
        }
        return newTimeSpent;
    },

    async getProjectsByArray(projectArray) {
        if (!projectArray) throw 'You must provide a list of project ids';
        const projectsCollection = await projects();
        const projectObjectArray = projectArray.map(x => ObjectId(x));
        console.log(projectObjectArray);
        const userProjects = await projectsCollection.find({ "_id": { "$in": projectObjectArray } }).toArray();
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