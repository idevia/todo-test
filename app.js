const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect('mongodb://idevia:noBound6@ds137508.mlab.com:37508/todo-test', { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(chalk.blue.bold('-::Database connected::-'));
  });

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.post('/addtask', (req, res) => {
  var newTask = req.body.newtask;
  let todo = new Todo();
  todo.title = newTask;
  todo.save();
  res.redirect("/");
});

app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  Todo.deleteOne({ _id: id }).exec();
  res.redirect('/');
})

app.get("/", async (req, res) => {
  const tasks = await Todo.find({});
  res.render("index", { tasks: tasks });
});

app.listen(3000, () => {
  console.log(chalk.yellow.bold('-::app listening on port 3000::-'))
});