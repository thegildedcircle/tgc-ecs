/**
 * ECS.Entity
 * @module Entity
 *
 * @param {string | number} id - The id of the entity.
 *
 * @return {Entity} Returns a new entity object. Entities have an id property
 * and a components property. Components is an array of all the `Component`s stored
 * in that entity.
 *
 * @description Entities are the core of the ECS pattern. In this implementation
 * entities store all the components associated to it in the components array.
 * There are a number of methods exposed to enable the addition, removal, and query
 * of components on an entity.
 *
 * It is not common to create entities directly, instead delegating that to the
 * ECS.Manager. Should you wish to use your own manager though, here is a brief
 * example:
 *
 * ```js
 * const { Entity } = require('ECS')
 * // Imaginary file that contains some components for our game
 * const { HealthComponent, NameComponent, DamageComponent } = require('./components')
 *
 * // Construct a new entity, use the current POSIX time as the entity id.
 * const player = Entity(Date.now())
 * // Add components to the player
 * player.addComponent(NameComponent({ value: 'Player One'}))
 * player.addComponent(HealthComponent({ value: 100 }))
 * player.addComponent(DamageComponent({ value: 50 }))
 *
 * player.hasComponent('name') // true
 * player.getComponent('health') // { value: 100 }
 * player.findComponents((c => c.state.value >= 50 )) // =>
 * // [
 * //   { name: 'health', unique: true, state: { value: 100 } },
 * //   { name: 'damage', unique: false, state: { value: 50 } }
 * // ]
 * ```
 */
module.exports = id => new Entity(id);

/**
 *
 * @classdesc An Entity is simply an object with an id and a list of all the
 * components associated with it. The class has a number of methods for adding,
 * removing, and querying the components stored on it.
 */
class Entity {
  /**
   * @class Entity Entity
   * @param {string | number} id - The unique id of the Entity. Typically id
   * generation is delegated to the `ECS.Manager`, but if you are rolling your
   * own you will need to have some method of id generation: Date.now() is the most
   * simple.
   * @param {Component[]} [components] - .
   *
   * @description Constructs an Entity with the supplied id, and optionally an
   * array of initial components. The component list is best used to defined
   * entity templates, known as an [assemblage](https://entity-system-js.readthedocs.io/en/latest/#assemblages),
   * and is used by the `ECS.Manager` when calling `ECS.Manager.registerEntityTemplate`.
   *
   * **Note:** You cannot call `new Entity()` directly, instead refer to the
   * {@link module:Entity} documentation.
   *
   */
  constructor(id, components = []) {
    this.id = id;
    this.components = [];
  }
  /**
   * @param {Component} component - .
   *
   * @description Adds a Component to the entity. When attempting to add more than
   * one instance of a Component that has the `.unique` property set to `true`,
   * this will print a warning and *not* add the new Component to the components
   * array.
   */
  addComponent(component) {
    if (component.unique && this.hasComponent(component.name)) {
      this.components = this.components.map(c => (c.name === component.name ? component : c));
    } else {
      this.components.push(component);
    }
  }
  /**
   * @param {Component} component - .
   *
   * @description Removes a component from the entity.
   */
  removeComponent(component) {
    this.components = this.components.filter(c => {
      return JSON.stringify(c) !== JSON.stringify(component);
    });
  }
  /**
   * @param {string} name - .
   *
   * @return {bool}
   *
   * @description Checks by name if a component exists on the entity. The name
   * string is matched against the `Component.name` property.
   */
  hasComponent(name) {
    return this.components.some(c => c.name === name);
  }
  /**
   * @param {string} name - The name of the Component to query.
   *
   * @return {Component}
   *
   * @description Gets a component stored on the entity by name. If more than one
   * component name matches, the first is returned.
   */
  getComponent(name) {
    return this.components.find(c => c.name === name);
  }
  /**
   * @param {function} predicate - The predicate function to test Components against.
   *
   * @return {Component[]} A list of all Components that match the supplied
   * predicate
   *
   * @description Gets all components on the entity that satisfy the supplied
   * predicate function.
   *
   * ```js
   * const { Entity } = require('ECS')
   * // Imaginary file that contains some components for our game
   * const { DamageComponent } = require('./components')
   *
   * const player = Entity(Date.now(), [
   *   DamageComponent({ value: 50 }),
   *   DamageComponent({ value: 150 }),
   *   DamageComponent({ value: 25 }),
   *   DamageComponent({ value: 5 }),
   * ])
   *
   * player.findComponents(c => c.name === 'damage' && c.state.value >= 50) // =>
   * // [
   * //   { name: 'damage', unique: false, state: { value: 50 } },
   * //   { name: 'damage', unique: false, state: { value: 150 } }
   * // ]
   * ```
   */
  findComponents(predicate) {
    return this.components.filter(predicate);
  }
}
