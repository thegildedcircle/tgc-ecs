// Generic function used to create new components. Typically called when you want
// to register a new component with the ECS.Manager.
module.exports = (name, unique, defaults) => (init = {}) => ({
  name,
  unique,
  state: Object.assign({}, defaults, init),
  update(state) {
    if (typeof this.state === "object") {
      for (const key in this.state) {
        if (state.hasOwnProperty(key)) this.state[key] = state[key];
      }
    } else {
      this.state = state;
    }
  }
});
