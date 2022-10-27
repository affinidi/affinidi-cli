const { generateApi } = require('swagger-typescript-api')
const path = require('path')
require('dotenv').config()

generateApi({
  name: 'user-management.api.ts',
  output: path.resolve(process.cwd(), './src/services/user-management'),
  url: `${process.env.APP_USER_MANAGEMENT_URL}/api/swagger`,
  httpClientType: 'axios'
}).catch(console.error)


generateApi({
  name: 'iam.api.ts',
  output: path.resolve(process.cwd(), './src/services/iam'),
  url: `${process.env.REACT_APP_AFFINIDI_IAM_URL}/api/swagger`,
  httpClientType: 'axios'
}).catch(console.error)
