//ADD EXPRESS THAT IS INSTALLED BUT NOT USED as per docs: https://socket.io/get-started/chat/
const express = require("express");
const app = express();
const http = require("http").Server(app);

const server = require("socket.io")(http);
const firstTodos = require("./data");
const Todo = require("./todo");

//START EXPRESS SERVER ON PORT 3003
app.listen(3003, () => console.log("Waiting for clients to connect"));
//ADD GET REQUEST WHEN SERVER IS RUN
app.use(express.static(__dirname + "/client"));
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/client");
// });

server.on("connection", client => {
  console.log("client connected to sockets");
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
