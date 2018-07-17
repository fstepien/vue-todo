const server = io({ transports: ["websocket"], upgrade: false });

function add() {
  // console.warn(event);
  const input = document.getElementById("todo-input");

  // Emit the new todo as some data to the server
  server.emit("make", {
    title: input.value
  });

  // Clear the input
  input.value = "";
  // TODO: refocus the element
}

function render(todo) {
  const listItem = document.createElement("li");
  const listItemText = document.createTextNode(todo.title);
  listItem.appendChild(listItemText);
  list.append(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server

// server.on("render_newTodo", todo => {
//   render(todo);
// });

const app = new Vue({
  el: "#app",
  data: {
    input: "",
    todos: []
  },
  components: {
    TodoList
  },
  created() {
    this.loadTodos();
  },
  methods: {
    loadTodos() {
      console.log(server);
      server.on("load", ({ todos, id }) => {
        this.todos = todos;
      });
    },
    add() {
      if (this.input === "") {
        alert("Please enter a TODO");
        return null;
      }
      console.log("add todo");
      server.emit("make", {
        title: this.input
      });
      this.input = "";
    }
  }
});
