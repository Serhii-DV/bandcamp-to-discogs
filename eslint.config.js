module.exports = [
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
      semi: "error"
    }
  }
];
