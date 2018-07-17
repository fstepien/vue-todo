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
connections = [];
const DB = firstTodos.map(t => {
  // Form new Todo ojects
  return new Todo((title = t.title));
});

io.on("connection", client => {
  const reloadTodos = () => {
    io.emit("load", DB);
  };

  // Send the DB downstream on connect ONLY if new client
  console.log(connections, client.id);
  !connections.includes(client.id) && reloadTodos();

  connections.push(client.id);
  // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...

  // Accepts when a client makes a new todo
  client.on("make", t => {
    // Make a new todo
    const newTodo = new Todo((title = t.title));
    // Push this newly created todo to our database
    DB.push(newTodo);
    // Send todo to clients
    io.emit("render_newTodo", newTodo);
  });

  client.on("disconnect", () => {
    connections.splice(connections.indexOf(client), 1);
    connections = [];
  });
});
