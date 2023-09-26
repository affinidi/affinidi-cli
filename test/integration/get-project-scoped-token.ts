import axios from 'axios'
import chalk from 'chalk'
import jwt from 'jsonwebtoken'
import qs from 'qs'

import 'dotenv/config'

const missingVariables = new Set()

const required = (name: string) => {
  missingVariables.add(name)
  return ''
}

const {
  KEY_ID = required('KEY_ID'),
  PASSPHRASE = required('PASSPHRASE'),
  PRIVATE_KEY = required('PRIVATE_KEY'),
  TOKEN_ENDPOINT = required('TOKEN_ENDPOINT') || '',
  MACHINE_USER_ID = required('MACHINE_USER_ID'),
  PROJECT_ID = required('PROJECT_ID'),
  API_GATEWAY_URL = required('API_GATEWAY_URL'),
} = process.env

const keyId = KEY_ID
const passphrase = PASSPHRASE
const privateKey = PRIVATE_KEY
const tokenEndpoint = TOKEN_ENDPOINT
const machineUserId = MACHINE_USER_ID
const projectId = PROJECT_ID
const apiGatewayUrl = API_GATEWAY_URL

if (missingVariables.size > 0) {
  console.log(`${chalk.red.bold('To run tests you should set all environment variables.')}\n`, {
    missing: [...missingVariables],
  })
  process.exit(0)
}

// NOTE: It seems /iam/v1/create-project-scoped-token endpoint has a hit limit.
//       Calling endpoint withing a few seconds will return an error.
export async function getProjectScopedToken() {
  const userAccessToken = await getUserAccessToken()

  const { data } = await axios(`${apiGatewayUrl}/iam/v1/create-project-scoped-token`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
      'Content-Type': 'application/json',
    },
    data: { projectId },
  })

  return data.accessToken
}

async function getUserAccessToken() {
  const token = signPayload()

  const input = qs.stringify({
    grant_type: 'client_credentials',
    scope: 'openid',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: token,
    client_id: machineUserId,
  })

  const { data } = await axios(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: input,
  })

  return data.access_token
}

function signPayload() {
  const issueTimeSeconds = Math.floor(new Date().getTime() / 1000)

  // TODO: rename to `token`, after Nucleus deploy changes
  const payload = {
    iss: machineUserId,
    sub: machineUserId,
    aud: tokenEndpoint,
    jti: new Date().toString() + Math.random(),
    exp: issueTimeSeconds + 5 * 60,
    iat: issueTimeSeconds,
  }

  const secret = { key: privateKey, passphrase } as any
  const options = { algorithm: 'RS256', keyid: keyId } as any

  const token = jwt.sign(payload, secret, options)

  return token
}
