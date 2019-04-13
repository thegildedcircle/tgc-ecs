/**
 * ECS.Manager
 * @module Manager
 */

const shortid = require("shortid");

const Entity = require("./Entity");

module.exports = class Manager {
  constructor(generator) {
    this.entities = [];
    this.entityTemplates = {};
    this.components = {};
    this.systems = {};
    this.systemQueue = [];
    this.debugger = {
      componentIsRegistered: c => this.components.hasOwnProperty(c),
      showComponent: c => this.components[c],
      templateIsRegistered: t => this.entityTemplates.hasOwnProperty(t),
      showTemplate: t => this.entityTemplates[t]
    };

    this.generateID =
      typeof generator === "function"
        ? generator
        : () => `e+${shortid.generate()}`;
  }
  // ---------------------------------------------------------------------------
  registerComponent(componentName, component) {
    this.components[componentName] = component;
  }

  deregisterComponent(componentName) {
    delete this.components[componentName];
  }

  registerEntityTemplate(templateName, components) {
    this.entityTemplates[templateName] = components;
  }

  deregisterEntityTemplate(templateName) {
    delete this.entityTemplates[templateName];
  }

  registerSystem(systemName, system) {
    this.systems[systemName] = system;
  }

  deregisterSystem(systemName) {
    delete this.systems[systemName];
  }

  // ---------------------------------------------------------------------------
  addEntity(template, components = []) {
    const entity = Entity(this.generateID());

    if (this.entityTemplates.hasOwnProperty(template)) {
      this.entityTemplates[template].forEach(c => {
        switch (typeof c) {
          case "string":
            if (this.components.hasOwnProperty(c))
              entity.addComponent(this.components[c]);
            break;
          case "object":
            entity.addComponent(c);
            break;
          case "function":
            entity.addComponent(c());
        }
      });
    }

    if (components.length > 0) {
      components.forEach(c => {
        switch (typeof c) {
          case "string":
            if (this.components.hasOwnProperty(c))
              entity.addComponent(this.components[c]);
            break;
          case "object":
            entity.addComponent(c);
            break;
          case "function":
            entity.addComponent(c());
        }
      });
    }

    this.entities.push(entity);

    return entity.id;
  }

  removeEntity(id) {
    this.entities = this.entities.filter(e => e.id !== id);
  }

  // ---------------------------------------------------------------------------
  runSystem(system) {
    switch (typeof system) {
      case "string":
        if (this.systems.hasOwnProperty(system))
          this.systems[system](this.entities);
        break;
      case "object":
        system(this.entities);
        break;
    }
  }

  queueSystem(system) {
    switch (typeof system) {
      case "string":
        if (this.systems.hasOwnProperty(system)) this.systemQueue.push(system);
        break;
      case "object":
        this.systemQueue.push(system);
        break;
    }
  }

  update() {
    while (this.systemQueue.length > 0) {
      const s = this.systemQueue.pop();

      typeof s === "string"
        ? this.systems[s].run(this.entities)
        : s.run(this.entities);
    }
  }
};
