/* bloop:managed commitlint */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
  },
};
/* bloop:end commitlint */
