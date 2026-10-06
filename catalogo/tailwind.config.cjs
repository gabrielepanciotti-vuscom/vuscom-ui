const path = require("node:path");
const root = path.resolve(__dirname, "..");

module.exports = {
  presets: [require("../src/theme/preset.cjs")],
  content: [
    path.join(root, "catalogo/**/*.{jsx,html}"),
    path.join(root, "src/**/*.{js,jsx}"),
  ],
};
