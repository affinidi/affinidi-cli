import chalk from 'chalk'

export async function createAuth0Resources(
  accessToken: string,
  domain: string,
  affinidiClientId: string,
  affinidiClientSecret: string,
  affinidiIssuer: string,
) {
  const { auth0ClientId, auth0ClientSecret } = await createApplication(accessToken, domain)
  const connectionName = 'Affinidi'
  await createSocialConnection(
    accessToken,
    domain,
    connectionName,
    auth0ClientId,
    affinidiClientId,
    affinidiClientSecret,
    affinidiIssuer,
  )
  return { auth0ClientId, auth0ClientSecret, connectionName }
}

const createApplication = async (accessToken: string, domain: string): Promise<any> => {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${accessToken}`)
  myHeaders.append('Content-Type', 'application/json')

  const body = JSON.stringify({
    name: 'Affinidi Reference App',
    description: 'Generated Reference Application from Affinidi CLI',
    logo_uri: '',
    callbacks: ['http://localhost:3000/api/auth/callback/auth0'],
    web_origins: ['http://localhost:3000'],
    allowed_logout_urls: ['http://localhost:3000'],
    jwt_configuration: {
      alg: 'RS256',
    },
    token_endpoint_auth_method: 'client_secret_post',
    app_type: 'regular_web',
    is_first_party: true,
    organization_usage: 'deny',
    oidc_conformant: true,
    organization_require_behavior: 'no_prompt',
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body,
  }

  const response = await fetch(`${domain}/api/v2/clients`, requestOptions)
  const reponseBody = await response.json()

  if (!reponseBody.client_id || !reponseBody.client_secret) {
    throw new Error(`Failed to create Auth0 Application. Response from Auth0: ${reponseBody.message}`)
  }

  return {
    auth0ClientId: reponseBody.client_id,
    auth0ClientSecret: reponseBody.client_secret,
  }
}

const createSocialConnection = async (
  accessToken: string,
  domain: string,
  name: string,
  auth0ClientId: string,
  affinidiClientId: string,
  affinidiClientSecret: string,
  affinidiIssuer: string,
): Promise<void> => {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${accessToken}`)
  myHeaders.append('Content-Type', 'application/json')

  const body = JSON.stringify({
    name: name,
    display_name: name,
    strategy: 'oauth2',
    options: {
      scope: 'openid offline_access',
      scripts: {
        fetchUserProfile:
          "function fetchUserProfile(accessToken, context, callback) { \n const idToken = JSON.parse(Buffer.from(context.id_token.split('.')[1], 'base64').toString()); \n const profile = { \n user_id: idToken.sub, \n email: idToken.custom.find(c => c.email).email, \n profile: idToken.custom \n }; \n callback(null, profile, context); \n }\n",
      },
      tokenURL: `${affinidiIssuer}/oauth2/token`,
      client_id: affinidiClientId,
      client_secret: affinidiClientSecret,
      customHeaders: '',
      authorizationURL: `${affinidiIssuer}/oauth2/auth`,
    },
    enabled_clients: [auth0ClientId],
  })

  const response = await fetch(`${domain}/api/v2/connections`, {
    method: 'POST',
    headers: myHeaders,
    body,
  })
  if (response.status !== 201) {
    const responseBody = await response.json()
    throw new Error(
      `Failed to create Auth0 Social Connection. Response from Auth0: ${chalk.red.bold(responseBody.message)}`,
    )
  }
}
