const TodoList = Vue.component("todo-list", {
  props: {
    todo: {
      type: Object,
      required: true
    },
    completed: {
      type: Boolean
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
  <div className="todo">
  <input 
    type="checkbox" 
    :checked="todo.completed" 
    @click="handleCheckboxToggle" 
    :disabled="!completed"/>
  {{todo.title}}
  <button 
    @click="deleteTodo" 
    :disabled="!completed">DELETE</button>
  </div>
  `
});
