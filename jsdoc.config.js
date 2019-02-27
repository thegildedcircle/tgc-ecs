module.exports = {
  tags: {
    allowUnknownTags: true,
    dictionaries: ["jsdoc"]
  },
  plugins: ["plugins/markdown"],
  opts: {
    template: "./node_modules/minami"
  }
};
