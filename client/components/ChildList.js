const ChildList = Vue.component("child-list", {
  props: {
    child: {
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
        "completed-class": this.child.completed
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
  <div class="child" :class="addCompletedClass">
    <div class="child__text">
        {{child.title}}
    </div>
    </div>
  </div>
  `
});
