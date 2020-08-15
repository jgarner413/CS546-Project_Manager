const mongoCollections = require('../config/mongoCollections');
const projects = mongoCollections.projects;
const users = mongoCollections.users;
const tasks = mongoCollections.tasks;
const { ObjectId } = require('mongodb');

module.exports = {
    async createTask(title, projectID, deadline, timespent, assigned_To) {
        let project_id = ObjectId(projectID);
        let assignedTo = ObjectId(assigned_To);
        if(!title || typeof title!= 'string') throw 'you must provide a valid title';
        if(!project_id || typeof project_id!= 'object') throw 'you must provide a valid project id';
        if(!assignedTo || typeof assignedTo!= 'object') throw 'you must provide a valid assigner';
        if(!timespent || typeof timespent!= 'string') throw 'you must provide a valid time';
        //if(!deadline || typeof deadline != 'Date') throw 'you must provide a valid time';
        //moment("06/22/2015", "MM/DD/YYYY", true).isValid(); true
        //may need moment.js package

        const tasksCollection = await tasks();
        let newTask = {
            title: title,
            project_id: project_id,
            deadline: deadline,
            timespent: timespent,
            assignedTo: assignedTo,
        }
        const insertInfo = await tasksCollection.insertOne(newTask);
        if (insertInfo.insertedCount === 0) throw 'Could not add task';
        const newId = insertInfo.insertedId;
        return await this.getTask(newId);
    },

    async getTask(id) {
        if (!id) throw 'You must provide a id to search for';

        const objId = ObjectId(id);
        const tasksCollection = await tasks();
        const task = await tasksCollection.findOne({ _id: objId });
        if (task === null) throw 'No user with this id';

        return task;
    },
    async getTaskByProjectID(projectId) {
        if (!projectId) throw 'You must provide a project id to search for';

        const objId = ObjectId(projectId);
        const tasksCollection = await tasks();
        const tasksForProject = await tasksCollection.find({ project_id: objId }).toArray();
        return tasksForProject;
    },

    async updateTask(taskId, title, timespent, deadline, assignedTo) {

        let task_Id = ObjectId(taskId);
        let assigned_To = ObjectId(assignedTo);
        if(!title || typeof title!= 'string') throw 'you must provide a valid title';
        //if(!project_id || typeof project_id!= 'object') throw 'you must provide a valid project id';
        if(!assigned_To || typeof assigned_To!= 'object') throw 'you must provide a valid assigner';
        if(!timespent || typeof timespent!= 'string') throw 'you must provide a valid time';


        const tasksCollection = await tasks();
        const updatedInfo = await tasksCollection.updateOne({ _id: task_Id }, { $set: {title: title, timespent: timespent,
            deadline: deadline, assignedTo: assigned_To}});
        if (updatedInfo.modifiedCount === 0) {
            throw 'Could not update project successfully';
        }

        return await this.getTask(task_Id);
    },


};