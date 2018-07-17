const TodoList = Vue.component("todo-list", {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleCheckboxToggle() {
      this.$root.$emit("checkbox-toggle", this.todo.id);
    }
  },
  template: `
  <div className="todo">
  <input type="checkbox" :checked="todo.completed" @click="this.handleCheckboxToggle"/>
  {{todo.title}}
  </div>
  `
});
