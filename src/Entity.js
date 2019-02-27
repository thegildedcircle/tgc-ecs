/**
 * ECS.Entity
 * @module ECS/Entity
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
 * const { HealthComponent, NameComponent } = require('./components')
 * 
 * // Construct a new entity, use the current POSIX time as the entity id.
 * const player = Entity(Date.now())
 * // Add components to the player
 * player.addComponent(NameComponent({ value: 'Player One'}))
 * player.addComponent(HealthComponent({ value: 100 }))
 * 
 * player.hasComponent('name') // true
 * player.getComponent('health') // { value: 100 }
 * player.findComponents((c => c.state.value === 100 )) // [{ value: 100 }]
 * ```
 */
module.exports = id => ({
  id,
  components: [],
  addComponent(component) {
    if (component.unique && this.hasComponent(component.name)) {
      console.warn(`Attempting to add non-unique component "${component.name}" to entity when one already exists.`)
    } else {
      this.components.push(component)
    }
  },
  removeComponent(component) {
    this.components = this.components.filter(c => {
      return JSON.stringify(c) !== JSON.stringify(component)
    })
  },
  hasComponent(name) {
    return this.components.some(c => c.name === name)
  },
  getComponent(name) {
    return this.components.find(c => c.name === name)
  },
  findComponents(predicate) {
    return this.components.filter(predicate)
  }
})