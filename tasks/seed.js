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
        let josh =  await users.addUser('Josh', 'Garner','jgarner413@gmail.com', josh_hash,
                'jgarner413','CS546 Project Manager developer');
        } catch (e) {
            console.log(e.toString());
    }
    
        

    try {
        let yunxiang_pwd = 'yunxiang123'
        let yun_hash = await bcrypt.hash(yunxiang_pwd, saltRounds);
        let yun =  await users.addUser('Yunxiang', 'Fan','Fan@gmail.com', yun_hash,
                'Fan','CS546 Project Manager developer');
        } catch (e) {
            console.log(e.toString());
    }
    try {
        let john_pwd = 'John123'
        let john_hash = await bcrypt.hash(john_pwd, saltRounds);
        let john =  await users.addUser('John', 'doe','jdoe@gmail.com', john_hash,
                'jdoe35','New user for cs546');
        } catch (e) {
            console.log(e.toString());
    }
    try {
        let lorem_pwd = 'lorem123'
        let lorem_hash = await bcrypt.hash(lorem_pwd, saltRounds);
        let lorem =  await users.addUser('Lorem', 'Ipsum','loremipsum@gmail.com', lorem_hash,
                'loremlorem','random text description');
        } catch (e) {
            console.log(e.toString());
    }

    try {
        let red_pwd = 'red123'
        let red_hash = await bcrypt.hash(red_pwd, saltRounds);
        let red =  await users.addUser('Red', 'Boxer','BoxingRed@gmail.com', red_hash,
                'RedBoxREd',"Josh's dog red");
        } catch (e) {
            console.log(e.toString());
    }
    
    await db.serverConfig.close();
}

main().catch((error) => {
    console.log('done seeding')
});