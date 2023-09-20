import fs from 'fs-extra'
import { AUTH_URL } from '../urls'

class Auth0Service {
  public generateAuth0Application = async (
    accessToken: string,
    domain: string,
    clientId: string,
    clientSecret: string,
    appPath: string,
  ): Promise<void> => {
    if (!fs.pathExistsSync(`${appPath}/.env.example`)) {
      throw new Error(`Unable to locate file .env.example in provided directory: ${appPath}`)
    }

    // Creating Application
    const { auth0ClientId, auth0ClientSecret } = await auth0Service.createApplication(accessToken, domain)

    fs.readFile(`${appPath}/.env.example`, 'utf-8', function (err, contents) {
      const updatedClientId = contents.replace(/AUTH0_CLIENT_ID=".*"/, `AUTH0_CLIENT_ID="${auth0ClientId}"`)
      const updatedClientSecret = updatedClientId.replace(
        /AUTH0_CLIENT_SECRET=".*"/,
        `AUTH0_CLIENT_SECRET="${auth0ClientSecret}"`,
      )
      const updatedIssuer = updatedClientSecret.replace(/AUTH0_ISSUER=".*"/, `AUTH0_ISSUER="${domain}"`)

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fs.writeFile(`${appPath}/.env.example`, updatedIssuer, 'utf-8')
    })

    //Creating Social Connection
    await auth0Service.creatingSocialConnection(accessToken, domain, auth0ClientId, clientId, clientSecret)
  }

  public createApplication = async (accessToken: string, domain: string): Promise<any> => {
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

  public creatingSocialConnection = async (
    accessToken: string,
    domain: string,
    auth0ClientId: string,
    clientId: string,
    clientSecret: string,
  ): Promise<void> => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${accessToken}`)
    myHeaders.append('Content-Type', 'application/json')

    const body = JSON.stringify({
      name: 'Affinidi',
      display_name: 'Affinidi',
      strategy: 'oauth2',
      options: {
        scope: 'openid',
        scripts: {
          fetchUserProfile:
            "function fetchUserProfile(accessToken, context, callback) { \n const idToken = JSON.parse(Buffer.from(context.id_token.split('.')[1], 'base64').toString()); \n const profile = { \n user_id: idToken.sub, \n email: idToken.custom.find(c => c.email).email, \n }; \n callback(null, profile, context); \n }\n",
        },
        tokenURL: `${AUTH_URL}/oauth2/token`,
        client_id: clientId,
        client_secret: clientSecret,
        customHeaders: '',
        authorizationURL: `${AUTH_URL}/oauth2/auth`,
      },
      enabled_clients: [auth0ClientId],
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body,
    }

    const response = await fetch(`${domain}/api/v2/connections`, requestOptions)
    if (response.status !== 201) {
      const responseBody = await response.json()
      throw new Error(`Failed to create Auth0 Social Connection. Response from Auth0: ${responseBody.message}`)
    }
  }
}

const auth0Service = new Auth0Service()
export { auth0Service }
