const path = require('path')

process.env.TS_NODE_PROJECT = path.resolve('tsconfig-test.json')
process.env.NODE_ENV = 'test'
// TODO remove or use carefully
process.env.AFFINIDI_CLI_ENVIRONMENT = 'test'
// END OF TODO remove or use carefully

global.oclif = global.oclif || {}
global.oclif.columns = 80
