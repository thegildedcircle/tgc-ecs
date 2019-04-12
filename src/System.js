/**
 * ECS.System
 * @module System
 *
 */
module.exports = (fn, state, options) => ({
  run(entities) {
    fn(entities, state);
  },
  state,
  options
});
