import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      "dist/**"
    ]
  },
  {
    files: [
      "src/**.js",
      "src/**.ts"
    ],
    rules: {
      "no-unused-vars": "error",
      semi: "error"
    }
  }
];
