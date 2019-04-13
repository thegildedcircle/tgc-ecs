/**
 * ECS.System
 * @module System
 *
 */
module.exports = (fn, state, options) => {
  console.log(state);
  return {
    run(entities) {
      console.log(this.state);
      fn(entities, this.state);
    },
    state,
    options,
  };
};
