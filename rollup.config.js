const typescript = require("@rollup/plugin-typescript");

/** @type {import("rollup").RollupOptions} */
module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ImageViewer"
    },
    {
      dir: "dist",
      format: "es"
    }
  ],
  preserveModules: false,
  plugins: [typescript()],
};
