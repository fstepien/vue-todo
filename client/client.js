const server = io.connect("http://localhost:3003/");

const app = new Vue({
  el: "#app",
  data: {
    input: "",

    todos: [
      {
        title: "Make Coffee",
        completed: false,
        id: "1",
        children: [
          {
            title: "Grind Beans",
            completed: false,
            id: "10"
          },
          {
            title: "Boil Water",
            completed: false,
            id: "11"
          },
          {
            title: "Add Beans and Water to French Press",
            completed: false,
            id: "12"
          },
          {
            title: "Wait 5 min",
            completed: false,
            id: "13"
          }
        ]
      }
    ],

    connected: false
  },
  components: {
    TodoList
  },
  created() {
    console.log(JSON.parse(localStorage.getItem("todos")));
    this.listenForSocketEvents();
    this.$on("checkbox-toggle", id => this.handleCheckboxToggle(id));
    this.$on("delete-todo", id => this.deleteTodoUsingId(id));
  },
  updated() {
    this.connected = server.connected;
    this.updateLocalStorage();
  },
  methods: {
    listenForSocketEvents() {
      console.log(server);
      this.connected = server.connected;
      // server.on("load", todos => {
      //   this.todos = todos;
      //   this.updateLocalStorage();
      // });
      server.on("render_newTodo", todo => {
        this.todos.push(todo);
      });
    },
    add() {
      //adds new todo item by sending "make" to server
      if (this.input.replace(/\s/g, "") === "") {
        alert("Please enter a TODO");
        return null;
      }
      server.emit("make", {
        title: this.input
      });
      this.input = "";
    },
    handleCheckboxToggle(id) {
      server.emit("toggle completed", {
        id
      });
    },
    deleteTodoUsingId(id) {
      server.emit("delete todo", {
        id
      });
    },
    completeAll() {
      server.emit("complete all");
    },
    deleteAll() {
      confirm("Do you want to DELETE ALL todo items?") &&
        server.emit("delete all");
    },
    updateLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    }
    // useLocalStorageIfDisconnected() {
    //   let localTodos = JSON.parse(localStorage.getItem("todos"));
    //   !this.connected && (this.todos = localTodos);
    // }
  }
  // mounted() {
  //   this.useLocalStorageIfDisconnected();
  // }
});
