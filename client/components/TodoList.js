const TodoList = Vue.component("todo-list", {
  props: {
    todo: {
      type: Object,
      required: true
    },
    connected: {
      type: Boolean
    }
  },
  computed: {
    completedText() {
      return this.todo.completed ? "REDO" : "COMPLETE";
    },
    addCompletedClass() {
      return {
        "completed-class": this.todo.completed
      };
    }
  },
  methods: {
    handleCheckboxToggle() {
      this.$root.$emit("checkbox-toggle", this.todo.id);
    },
    deleteTodo() {
      confirm("are you sure you want to delete?") &&
        this.$root.$emit("delete-todo", this.todo.id);
    }
  },
  template: `
  <div class="todo" :class="addCompletedClass">
    <div class="todo__text">
        {{todo.title}}
    </div>
    <div class="todo__btns">

        <button
     
        :checked="todo.completed" 
        @click="handleCheckboxToggle" 
        :disabled="!connected">{{completedText}} </button>

        <button 
        @click="deleteTodo" 
        :disabled="!connected">DELETE</button>

    </div>
  </div>
  `
});
