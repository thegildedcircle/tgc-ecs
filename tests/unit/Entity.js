const { expect } = require("chai");

const Entity = require("../../.dev/Entity");

const mockID = Date.now();
const mockEntity = Entity(mockID);

const mockComponent = {
  name: "attrs",
  unique: true,
  state: {
    health: 100,
    mana: 100
  }
};

describe("Entity test suite", () => {
  describe("Construction...", () => {
    it(`Should have an id of ${mockID}`, () => {
      expect(mockEntity.id).to.equal(mockID);
    });
  });

  describe("Updates...", () => {
    it(`Should have an "attrs" component`, () => {
      mockEntity.addComponent(mockComponent);

      expect(mockEntity.hasComponent("attrs")).to.be.true;
    });

    it(`Should only have 1 "attrs" component`, () => {
      mockEntity.addComponent(mockComponent);

      expect(
        mockEntity.findComponents(c => c.name === "attrs").length
      ).to.equal(1);
    });
  });
});
