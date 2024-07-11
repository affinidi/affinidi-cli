import { copyFile, readFile, writeFile } from 'fs/promises'

export type LoginParams = {
  clientId: string
  clientSecret: string
  issuer: string
  connectionName?: string
}

export type TokenParams = {
  projectId: string
  tokenId: string
  privateKey: string
}

export async function configureAppEnvironment(path: string, loginParams: LoginParams, tokenParams?: TokenParams) {
  const donEnv = `${path}/.env`
  const donEnvExample = `${path}/.env.example`

  // if (!pathExistsSync(donEnvExample)) {
  //   throw new Error(`Unable to locate file .env.example in provided directory: ${path}`)
  // }

  await copyFile(donEnvExample, donEnv)

  let envContent = await readFile(donEnv, 'utf-8')
  envContent = envContent.replace(/PROVIDER_CLIENT_ID=".*"/, `PROVIDER_CLIENT_ID="${loginParams.clientId}"`)
  envContent = envContent.replace(/PROVIDER_CLIENT_SECRET=".*"/, `PROVIDER_CLIENT_SECRET="${loginParams.clientSecret}"`)
  envContent = envContent.replace(/PROVIDER_ISSUER=".*"/, `PROVIDER_ISSUER="${loginParams.issuer}"`)

  if (loginParams.connectionName) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_SOCIAL_CONNECTOR_NAME=".*"/,
      `NEXT_PUBLIC_SOCIAL_CONNECTOR_NAME="${loginParams.connectionName}"`,
    )
  }

  if (tokenParams) {
    envContent = envContent.replace(/PROJECT_ID=".*"/, `PROJECT_ID="${tokenParams.projectId}"`)
    envContent = envContent.replace(/TOKEN_ID=".*"/, `TOKEN_ID="${tokenParams.tokenId}"`)
    envContent = envContent.replace(/PRIVATE_KEY=".*"/, `PRIVATE_KEY="${tokenParams.privateKey}"`)
  }

  await writeFile(donEnv, envContent, 'utf-8')
}
