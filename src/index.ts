import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Group} from "./entity/Group";

createConnection().then(async connection => {
    let date = new Date()
    let dateYMD = date.toLocaleDateString ("fr-CA");

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.nickname = "Timber";
    user.created = String(dateYMD);

    const group = new Group();
    group.name = "Blue";
    group.description = "Group with blue flag";

    await connection.manager.save(user);
    await connection.manager.save(group);


    console.log("Saved a new user with id: " + user.id);
    console.log("Saved a new group with id: " + group.id + " ,name: " + group.name);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Loading groups from the database...");
    const groups = await connection.manager.find(Group);
    console.log("Loaded groups: ", groups);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
