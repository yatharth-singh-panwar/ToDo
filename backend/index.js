const express = require('express');
const cors = require('cors');
const { getAllTodo, createTodo, updateTodo, deleteTodoById, toggleStateOfTasks } = require('./routes/todo'); // importing callback functions for routes
const PORT = 3001;
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://yatharthSingh:Yatharth123@cluster0.tgb5g.mongodb.net/ToDoApplication");

const jwt = require("jsonwebtoken");
const SECRET_PHRASE = "yatharth";
const {taskModel, userModel} = require('../database/db.js');

app.use(cors());
app.use(express.json());


//sign up logic. 
app.post('/signup', async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

    await userModel.create({
      userName: userName,
      password: password
    });
    res.json({ msg: "You are signed up!" });
})
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
