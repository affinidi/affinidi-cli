module.exports = {
    extends: ['@commitlint/config-conventional'],
    // more rules: https://commitlint.js.org/#/reference-rules
    rules: {
        'type-enum': [2, 'always', ['release', 'feat', 'fix', 'perf', 'chore', 'docs', "test", "build"]],
        'subject-empty': [2, 'never'],
    },
};
