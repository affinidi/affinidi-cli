module.exports = {
  extends: ['oclif', 'oclif-typescript', '@affinidi/eslint-config', 'plugin:mocha/recommended'],
  parserOptions: {
    project: ['tsconfig.json'],
  },
  rules: {
    'mocha/no-mocha-arrows': 0,
    'mocha/no-setup-in-describe': 0,
  },
}
