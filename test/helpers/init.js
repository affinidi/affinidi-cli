const path = require('path')

process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.NODE_ENV = 'test'
// TODO remove or use carefully
process.env.AFFINIDI_CLI_ENVIRONMENT = 'test'
// END OF TODO remove or use carefully

process.env.TOKEN_GETTER_FUNCTION_ARN =
  'arn:aws:lambda:ap-southeast-1:792104784284:function:iam-dev-CreateProjectScopedTokenForTestUser2A2CF63-g9P9ag4v4csS:live-alias'
process.env.TOKEN_GETTER_FUNCTION_INVOKER_ROLE_ARN =
  'arn:aws:iam::792104784284:role/iam-dev-TestUserTokenGetterRole1408BB67-1DHZ4B083S1PF'
process.env.AWS_REGION = 'ap-southeast-1'

global.oclif = global.oclif || {}
global.oclif.columns = 80
