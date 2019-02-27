const { expect } = require("chai");

const Entity = require("../.dev/Entity");
const Component = require("../.dev/Component");
const System = require("../.dev/System");
const Manager = require("../.dev/Manager");

describe("ECS test suite", () => {
  describe("Component construction", () => {
    const HealthComponent = Component("health", true, { value: 100 })();

    it(`Should create a Component called "health"`, () => {
      expect(HealthComponent.name).to.equal("health");
    });

    it(`Should be unique`, () => {
      expect(HealthComponent.unique).to.be.true;
    });

    it(`Should have a "value" of 100`, () => {
      expect(HealthComponent.state.value).to.equal(100);
    });
  });

  describe("Component update", () => {
    const AttributeComponent = Component("attrs", true, {
      health: 100,
      mana: 100,
      stamina: 100
    })();

    it(`Should create a Component with "health", "mana", and "stamina" values defauled to 100`, () => {
      expect(AttributeComponent.state.health).to.equal(100);
      expect(AttributeComponent.state.mana).to.equal(100);
      expect(AttributeComponent.state.stamina).to.equal(100);
    });

    it(`Should update only "mana" to 200`, () => {
      AttributeComponent.update({ mana: 200 });

      expect(AttributeComponent.state.health).to.equal(100);
      expect(AttributeComponent.state.mana).to.equal(200);
      expect(AttributeComponent.state.stamina).to.equal(100);
    });
  });
});
