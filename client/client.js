const server = io({ transports: ["websocket"], upgrade: false });
// const server = io.connect("http://localhost:3003/");

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
    this.listenForSocketEvents();
    this.$on("checkbox-toggle", id => this.handleCheckboxToggle(id));
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
      if (this.input === "") {
        alert("Please enter a TODO");
        return null;
      }
      console.log("add todo");
      server.emit("make", {
        title: this.input
      });
      this.input = "";
    },
    handleCheckboxToggle(id) {
      console.log("toggle", id);
      server.emit("toggle completed", {
        id
      });
    }
  }
});
