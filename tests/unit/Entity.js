const { expect } = require("chai");

const Entity = require("../../.dev/Entity");
const Component = require("../../.dev/Component");

describe("Entity test suite", () => {
  describe("Construction...", () => {
    const id = Date.now();
    const TestEntity = Entity(id);

    it(`Should have an id of ${id}`, () => {
      expect(TestEntity.id).to.equal(id);
    });
  });

  describe("Updates...", () => {
    const AttributeComponent = Component("attrs", true, {
      health: 100,
      mana: 100
    });

    const TestEntity = Entity(Date.now());

    it(`Should have an "attrs" component`, () => {
      TestEntity.addComponent(AttributeComponent());

      expect(TestEntity.hasComponent("attrs")).to.be.true;
    });

    it(`Should only have 1 "attrs" component`, () => {
      TestEntity.addComponent(AttributeComponent());

      expect(
        TestEntity.findComponents(c => c.name === "attrs").length
      ).to.equal(1);
    });
  });
});
