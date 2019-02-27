const {
  expect
} = require("chai");

const Component = require("../.dev/Component");

describe("Component test suite", () => {
  describe("Construction...", () => {
    const HealthComponent = Component("health", true, {
      value: 100
    })();

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

  describe("Updates...", () => {
    const AttributeComponent = Component("attrs", true, {
      health: 100,
      mana: 100
    })();

    it(`Should create a Component with "health" and "mana" values defauled to 100`, () => {
      expect(AttributeComponent.state.health).to.equal(100);
      expect(AttributeComponent.state.mana).to.equal(100);
    });

    it(`Should update only "mana" to 200`, () => {
      AttributeComponent.update({
        mana: 200
      });

      expect(AttributeComponent.state.health).to.equal(100);
      expect(AttributeComponent.state.mana).to.equal(200);
    });

    it(`Should not add a stamina property`, () => {
      AttributeComponent.update({
        stamina: 100
      });

      expect(AttributeComponent.state.stamina).to.be.undefined;
    });
  });
});