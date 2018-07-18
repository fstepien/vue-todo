const express = require("express");
const socket = require("socket.io");

const firstTodos = require("./data");
const Todo = require("./todo");

//Start express server on port 3003 + serve static files from new client folter through express middleware
const app = express();
const http = require("http").Server(app);
const server = app.listen(3003, () =>
  console.log("Waiting for clients to connect")
);
app.use(express.static(__dirname + "/client"));

let DB = firstTodos.map(t => {
  // Form new Todo ojects
  return new Todo((title = t.title));
});

//set up sockets on server side + listen to connection
const io = socket(server);
io.on("connection", client => {
  console.log("client connected", client.id);

  // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...

  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    io.emit("load", { todos: DB, id: client.id });
  };

  // Create New Todo
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
  client.on("destroyed", () => {
    console.log("destroyed component");
  });

  reloadTodos();
});
