// const server = io({ transports: ["websocket"], upgrade: false });
const server = io.connect("http://localhost:3003/");

const app = new Vue({
  el: "#main",
  data: {
    input: "",
    todos: []
  },
  components: {
    TodoList
  },
  created() {
    this.listenForSocketEvents();
    this.$on("checkbox-toggle", id => this.handleCheckboxToggle(id));
    this.$on("delete-todo", id => this.deleteTodoUsingId(id));
  },
  updated() {
    this.checkLocalStorage();
  },
  methods: {
    listenForSocketEvents() {
      console.log(server);
      server.on("load", ({ todos, id }) => {
        this.todos = todos;
      });
      server.on("render_newTodo", todo => {
        this.todos.push(todo);
      });
    },
    add() {
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
    checkLocalStorage() {
      localStorage.getItem("todos") === null
        ? this.addTodosToLocalStorage()
        : this.consolidateTodosWithLocalStorage();
    },
    addTodosToLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    consolidateTodosWithLocalStorage() {
      console.log("need to consolidate with local storage");
    }
  }
});
