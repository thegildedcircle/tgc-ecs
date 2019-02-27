/**
 * ECS.Component
 * @module ECS/Component
 */

/**
 * @name Component
 * @function
 *
 * @param   {string}  name      - The name of the component.
 * @param   {bool}    unique    - Whether or not a component can have more than one instance of this component.
 * @param   {Object}  defaults  - The default state of every instance of this component.
 *
 * @return  {Function} Returns a constructor for the new component. The returned
 * constructor optionally takes a `init` object to initialise the component with
 * values different from the component defaults described above.
 *
 * @description A generic function used to create new components. Most typically
 * used when registering a new component to an ECS.Manager with `ECS.Manager.registerComponent(...)`.
 *
 * Note that the function returns another function before finally returning the
 * complete component object. The initial call provides the constructor for your
 * new type of component, you may then call this constructor with the initial values
 * for that specific instance of your component:
 * ```js
 * const { Component, Manager } = require('ECS')
 *
 * // Create a component to track the health of an entity
 * const HealthComponent = ECS.Component('health', true {
 *   value: 100
 * })
 * // Register that component with the ECS Manager
 * ECS.Manager.registerComponent(HealthComponent)
 *
 * // Create a new entity that has our health component
 * ECS.Manager.addEntity([ 'health' ])
 * // Create a new entity that overrides the default health value
 * ECS.Manager.addEntity([
 *   ECS.Manager.components.health({ value: 200 })
 * ])
 * ```
 */
module.exports = (name, unique, defaults) => (init = {}) => {
  const state = {};
  // Override the component defaults if some initial values are supplied when
  // constructing an instance of the component. Defaults still dictates the shape
  // of the component, properties defined in init but not defaults are ignored.
  for (const key in defaults) {
    state[key] = init.hasOwnProperty(key) ? init[key] : defaults[key];
  }

  return {
    name,
    unique,
    state,
    // Iterate through the keys in the *internal* state object. This ensures
    // new keys aren't accidentally added to the component state.
    // If the incoming state has a key that matches, update internal state
    // with the new value, if not then internal state remains unchanged. This
    // enables the possibility of supplying only the necessary parts of updated
    // state instead of the whole object.
    update(state) {
      for (const key in this.state) {
        this.state[key] = state.hasOwnProperty(key)
          ? state[key]
          : this.state[key];
      }
    }
  };
};
