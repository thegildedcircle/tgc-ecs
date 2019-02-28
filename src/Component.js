/**
 * ECS.Component
 * @module Component
 * 
 * @param   {string}  name      - The name of the component.
 * @param   {bool}    unique    - Whether or not a component can have more than one instance of this component.
 * @param   {Object}  defaults  - The default state of every instance of this component.
 *
 * @return  {Function(Object): Component} Returns a constructor for the new component. The returned
 * constructor optionally takes a `init` object to initialise the component with
 * values different from the component defaults described above.
 * 
 * ```js
 * const HealthComponent = Component('health', true, { value: 100 }) 
 * // HealthComponent is now a function:
 * // (init = {}) => ({ name: 'health', unique: true, state: { value: 100 } })
 * 
 * HealthComponent({ value: 200 }) // ({ name: 'health', unique: true, state: { value: 200 } })
 * ```
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
 * const HealthComponent = Component('health', true {
 *   value: 100
 * })
 * // Register that component with the ECS Manager
 * Manager.registerComponent(HealthComponent)
 *
 * // Create a new entity that has our health component
 * Manager.addEntity([ 'health' ])
 * // Create a new entity that overrides the default health value
 * Manager.addEntity([
 *   Manager.components.health({ value: 200 })
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

  return new Component(name, unique, state)
};

/**
 * @classdesc A Component encapsulates some piece of data. Components themselves
 * don't typically have functionality attached to them like traditional classes,
 * instead `Systems` are functions that manipulate the data stored in specific
 * components. 
 */
class Component {
  /**
   * @param {string} name - The name of the Component type. This should be unique.
   * @param {bool} unique - Whether or not the Component is unique: whether more than
   * one instance of this Component can be stored on an Entity.
   * @param {Object} state - An object containing all the attributes relevant to
   * the Component. Some best practices to follow:
   * 
   * - `state` should be completely serialisable. Functions should **never** be
   * stored on a Component.
   * - Try to keep `state` as flat as possible, if you find yourself nesting objects,
   * there's a good chance you might want another Component instead.
   * 
   * @description Constructs a Component
   * 
   * **Note:** You cannot call `new Component()` directly, instead refer to the 
   * {@link module:Component} documentation.
   */
  constructor(name, unique, state) {
    this.name = name
    this.unique = unique
    this.state = state
  }

  /**
   * @param {object} newState - An object containing an updated version of this
   * Components state. This can be partially filled if only some properties are
   * updated.
   * 
   * @description Updates the component state, either partially or fully, the
   * values in `newState`. Additional properties cannot be added to the Component
   * by calling update and properties found in the Component state but not in `newState`
   * are simply left unchanges.
   */
  update(newState) {
    for (const key in this.state) {
      this.state[key] = newState.hasOwnProperty(key) ?
        newState[key] :
        this.state[key];
    }
  }
}