/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  env: {
    browser: true,
  },
  globals: {
    React: "writable",
    JSX: "writable",
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: '@repo/typescript-config/react-internal.json',
  },
};
