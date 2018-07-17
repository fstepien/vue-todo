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

//set up sockets on server side + listen to connection
const io = socket(server);
io.on("connection", client => {
  console.log("client connected to sockets", client.id);
  // This is going to be our fake 'database' for this application
  // Parse all default Todo's from db

  // FIXME: DB is reloading on client refresh. It should be persistent on new client
  // connections from the last time the server was run...
  const DB = firstTodos.map(t => {
    // Form new Todo ojects
    return new Todo((title = t.title));
  });

  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    server.emit("load", DB);
  };

  // Accepts when a client makes a new todo
  client.on("make", t => {
    // Make a new todo
    const newTodo = new Todo((title = t.title));

    // Push this newly created todo to our database
    DB.push(newTodo);

    // Send the latest todos to the client
    // FIXME: This sends all todos every time, could this be more efficient?
    reloadTodos();
  });

  // Send the DB downstream on connect
  reloadTodos();
});

// server.listen(3003);
// CHANGED server.listen() to app.listen()
// app.listen(3003);
