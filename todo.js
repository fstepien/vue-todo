const uuidv1 = require("uuid/v1");

module.exports = class Todo {
  constructor(title = "") {
    this.title = title;
    this.completed = false;
    this.id = uuidv1();
  }
};
