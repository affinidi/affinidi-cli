const { generateApi } = require('swagger-typescript-api')
const path = require('path')

generateApi({
  name: 'vp-adapter.api.ts',
  output: path.resolve(process.cwd(), './src/services/affinidi/vp-adapter'),
  input: path.resolve(process.cwd(), './scripts/vp.yaml'),
  httpClientType: 'axios',
}).catch(console.error)

generateApi({
  name: 'iam.api.ts',
  output: path.resolve(process.cwd(), './src/services/affinidi/iam'),
  input: path.resolve(process.cwd(), './scripts/iam.yaml'),
  httpClientType: 'axios',
}).catch(console.error)
