const { generateApi } = require('swagger-typescript-api')
const path = require('path')
require('dotenv').config()

generateApi({
  name: 'user-management.api.ts',
  output: path.resolve(process.cwd(), './src/services/user-management'),
  url: `${process.env.APP_USER_MANAGEMENT_URL}/api/swagger`,
  httpClientType: 'axios'
}).catch(console.error)
