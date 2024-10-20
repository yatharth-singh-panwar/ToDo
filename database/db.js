    const mongoose = require("mongoose");
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    // Defining a new schema for posts
    const posts = new Schema({
        userId: ObjectId,
        taskHeading: String,
        completed: Boolean
    });

    // Defining a new schema for the users
    const users = new Schema({
        userName: {type: String, unique: true},
        password: String
    });

    // Defining a model which stores the schema and the collection to store both the schemas in 
    const taskModel = mongoose.model('todo', posts);
    const userModel = mongoose.model('userInfo', users);

    module.exports = {
        taskModel,
        userModel
    };