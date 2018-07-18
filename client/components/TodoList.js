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
    :disabled="!connected"/>
  {{todo.title}}
  <button 
    @click="deleteTodo" 
    :disabled="!connected">DELETE</button>
  </div>
  `
});
