module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/base", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
      },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    // parser: "babel-eslint",
    sourceType: "module",
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  globals: {
    // uni: "writable",
  },
  // imgnore:{}
};
