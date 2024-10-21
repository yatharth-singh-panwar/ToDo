const express = require('express');
const cors = require('cors');
const { getAllTodo, createTodo, updateTodo, deleteTodoById, toggleStateOfTasks } = require('./routes/todo'); // importing callback functions for routes
const PORT = 3001;
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '..', 'frontend')));
let db;
const mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('Failed to connect to MongoDB:', error));


const jwt = require("jsonwebtoken");
const SECRET_PHRASE = "yatharth";
const {taskModel, userModel} = require('../backend/database/db.js');

app.use(cors());
app.use(express.json());


//sign up logic. 

app.post('/signup', async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  console.log(userName);
  console.log(password);
 
  try{
    await userModel.create({
      
      userName: userName,
      password: password
    });
    // const newUser = new userModel({ userName, password });
    // await newUser.save();
    console.log(req.body);
    res.json({ msg: "You are signed up!" });
  }
  catch(err){
    console.log(err, "The user creation failed. ");
  }
})

app.get('/api/data', async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection('userInfo').find({}).toArray(); // Use mongoose.connection.db
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/signin', async (req, res) => {
  const userName = req.body.userName;
  const passWord = req.body.passWord;
  const user = await userModel.findOne({
    userName: userName,
    password: passWord
  });

  if (user) {
    const token = jwt.sign({
      id: user._id
    }, SECRET_PHRASE);
    res.json({
      token,
      msg: "You have successfully logged in."
    });
  } else {
    res.status(403).json({
      msg: "Incorrect credentials"
    });
  }
});


//sign in logic.

// Get all todos
app.get('/todos', getAllTodo);

// Add a new todo
app.post('/todos', createTodo);

// Update a todo
app.put('/todos/:id', updateTodo);

// Delete a todo
app.delete('/todos/:id', deleteTodoById);


// TODO: can you implement search todo route ???
// app.get('/search', searchToDo);
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
