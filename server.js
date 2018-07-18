const express = require("express");
const socket = require("socket.io");

const firstTodos = require("./data");
const Todo = require("./todo");

//Start express server on port 3003 + serve static files from new client folder through express middleware
const app = express();
const http = require("http").Server(app);
const server = app.listen(3003, () =>
  console.log(
    "Waiting for clients to connect at '\x1b[36mhttp://localhost:3003\x1b[0m'"
  )
);
app.use(express.static(__dirname + "/client"));

let DB = firstTodos.map(t => {
  // add new Todo objects with unique ID and completed set to false
  return new Todo((title = t.title));
});

//set up sockets on server side + listen to connection
const io = socket(server);
io.on("connection", client => {
  console.log("client connected", client.id);

  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    io.emit("load", DB);
  };

  // Create New Todo when recives "make" from client
  client.on("make", t => {
    //1. Make new Todo 2. add to DB array 3. send the created todo to client
    const newTodo = new Todo((title = t.title));
    DB.push(newTodo);
    io.emit("render_newTodo", newTodo);
  });

  //toggles completed key based on todo id
  client.on("toggle completed", payload => {
    let todoIndex = DB.findIndex(todo => todo.id === payload.id);
    DB[todoIndex].completed = !DB[todoIndex].completed;
    reloadTodos();
  });

  //delete todo with received id
  client.on("delete todo", payload => {
    let todoIndex = DB.findIndex(todo => todo.id === payload.id);
    DB.splice(todoIndex, 1);
    reloadTodos();
  });

  client.on("complete all", () => {
    DB.forEach(todo => (todo.completed = true));
    reloadTodos();
  });

  client.on("delete all", () => {
    DB = [];
    reloadTodos();
  });

  reloadTodos();
});
