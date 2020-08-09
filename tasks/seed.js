const dbConnection = require('../config/mongoConnection');
const bcrypt = require('bcrypt');
const data = require('../data/');
const users = data.users;
const projects = data.projects;
const tasks = data.tasks;
const saltRounds = 16;


async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    try {
        let josh_pwd = 'josh123'
        let josh_hash = await bcrypt.hash(josh_pwd, saltRounds);
        var josh =  await users.addUser('Josh', 'Garner','jgarner413@gmail.com', josh_hash,
                'jgarner413','CS546 Project Manager developer');
        console.log(typeof josh._id)
        } catch (e) {
            console.log(e.toString());
    }
    
    try {
        let yunxiang_pwd = 'yunxiang123'
        let yun_hash = await bcrypt.hash(yunxiang_pwd, saltRounds);
        var yun =  await users.addUser('Yunxiang', 'Fan','Fan@gmail.com', yun_hash,
                'Fan','CS546 Project Manager developer');
        } catch (e) {
            console.log(e.toString());
    }
    try {
        let john_pwd = 'John123'
        let john_hash = await bcrypt.hash(john_pwd, saltRounds);
        var john =  await users.addUser('John', 'doe','jdoe@gmail.com', john_hash,
                'jdoe35','New user for cs546');
        } catch (e) {
            console.log(e.toString());
    }
    try {
        let lorem_pwd = 'lorem123'
        let lorem_hash = await bcrypt.hash(lorem_pwd, saltRounds);
        var lorem =  await users.addUser('Lorem', 'Ipsum','loremipsum@gmail.com', lorem_hash,
                'loremlorem','random text description');
        } catch (e) {
            console.log(e.toString());
    }

    try {
        let red_pwd = 'red123'
        let red_hash = await bcrypt.hash(red_pwd, saltRounds);
        var red =  await users.addUser('Red', 'Boxer','BoxingRed@gmail.com', red_hash,
                'RedBoxREd',"Josh's dog red");
        } catch (e) {
            console.log(e.toString());
    }

    try {
        var cs546_final = await projects.createProject('CS546 Project Management Application', 'A project management application to help users build out their projects', josh._id,
            new Date(2020, 7, 21) , '0',[yun._id],[]); //Date is 0 indexed
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.createProject('Building a chatbot', 'Tasks on building out our chatbot', josh._id,
            new Date(2020, 8, 18) , '0',[],[]); //Date is 0 indexed
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.createProject('Finance Group Project', 'Presentation and analysys for finance class', red._id,
            new Date(2020, 10, 30) , '0',[josh._id],[]); //Date month is 0 indexed
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await projects.createProject('Building a house', 'Guide on how we are building a house. Write what tasks you are completing below', lorem._id,
            new Date(2020, 10, 30) , '0',[josh._id],[]); //Date month is 0 indexed
    } catch (e) {
        console.log(e.toString());
    }

    try {
        await tasks.createTask('create proposal', cs546_final._id, new Date(2020, 6, 3), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }
    try {
        await tasks.createTask('create db proposal', cs546_final._id, new Date(2020, 6, 21), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }
    try {
        await tasks.createTask('create project pitch', cs546_final._id, new Date(2020, 7, 3), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }
    try {
        await tasks.createTask('create db', cs546_final._id, new Date(2020, 7, 3), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }
    try {
        await tasks.createTask('build login page', cs546_final._id, new Date(2020, 7, 3), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }
    try {
        await tasks.createTask('build dashboard', cs546_final._id, new Date(2020, 7, 3), "0", josh._id)
    } catch (e) {
        console.log(e.toString());
    }

    
    await db.serverConfig.close();
    console.log('done seeding')
}

main().catch((error) => {
    console.log(error.toString());
});