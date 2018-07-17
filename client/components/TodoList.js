const TodoList = Vue.component("todo-list", {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
  <div className="todo">
  {{todo.title}}
  </div>
  
  `
});
