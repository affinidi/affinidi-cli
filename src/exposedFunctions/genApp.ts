import { CliUx } from '@oclif/core'
import path from 'path'

import { analyticsService, generateUserMetadata } from '../services/analytics'
import { CliError, InvalidUseCase, NotSupportedPlatform, Unauthorized } from '../errors'
import { displayOutput } from '../middleware/display'
import { getSession } from '../services/user-management'
import { EventDTO } from '../services/analytics/analytics.api'
import { GitService, Writer } from '../services'
import { buildGeneratedAppNextStepsMessage } from '../render/texts'
import { fakeJWT } from '../render/functions'
import { ViewFormat } from '../constants'

export interface FlagsInput {
  platform?: PlatformType
  name?: string
  use_case?: UseCaseType
  output?: ViewFormat
  apiKey: string
  projectDid: string
  projectId: string
}

export enum Platforms {
  web = 'web',
  mobile = 'mobile',
}

export enum UseCasesAppNames {
  portableReputation = 'portable-reputation',
  accessWithoutOwnershipOfData = 'access-without-ownership-of-data',
  healthReferenceApp = 'health',
  educationReferenceApp = 'education',
  ticketingReferenceApp = 'ticketing',
  kycKyb = 'kyc-kyb',
}

type UseCaseType = `${UseCasesAppNames}`
type PlatformType = `${Platforms}`

const UseCaseSources: Record<UseCaseType, string> = {
  'portable-reputation': 'https://github.com/affinidi/reference-app-portable-reputation.git',
  'access-without-ownership-of-data': 'NOT IMPLEMENTED YET',
  health: 'https://github.com/affinidi/reference-app-health.git',
  education: 'https://github.com/affinidi/reference-app-education.git',
  ticketing: 'https://github.com/affinidi/reference-app-ticketing.git',
  'kyc-kyb': 'NOT IMPLEMENTED YET',
}

const download = async (gitUrl: string, destination: string): Promise<void> => {
  try {
    await GitService.clone(gitUrl, destination)
  } catch (error) {
    throw Error(`Download Failed: ${error.message}`)
  }
}

const setUpProject = async (name: string, flags: FlagsInput): Promise<void> => {
  const { apiKey, projectDid, projectId } = flags

  const activeProjectApiKey = apiKey
  const activeProjectDid = projectDid
  const activeProjectId = projectId

  if (!activeProjectApiKey || !activeProjectDid || !activeProjectId) {
    throw Error(Unauthorized)
  }

  displayOutput({ itemToDisplay: `Setting up the project`, flag: flags.output })

  try {
    if (flags.use_case === UseCasesAppNames.portableReputation) {
      Writer.write(path.join(name, '.env'), [
        '# frontend-only envs',
        'NEXT_PUBLIC_HOST=http://localhost:3000',
        '',
        '# backend-only envs',
        'CLOUD_WALLET_API_URL=https://cloud-wallet-api.prod.affinity-project.org/api',
        'AFFINIDI_IAM_API_URL=https://affinidi-iam.apse1.affinidi.com/api',
        'ISSUANCE_API_URL=https://console-vc-issuance.apse1.affinidi.com/api',
        '',
        `PROJECT_ID=${activeProjectId}`,
        `PROJECT_DID=${activeProjectDid}`,
        `API_KEY_HASH=${activeProjectApiKey}`,
        '',
        `AUTH_JWT_SECRET=${fakeJWT() + fakeJWT() + fakeJWT()}`,
        'GITHUB_APP_CLIENT_ID=',
        'GITHUB_APP_CLIENT_SECRET=',
        '',
        'LOG_LEVEL=debug',
      ])

      return
    }

    Writer.write(path.join(name, '.env'), [
      '# frontend-only envs',
      'NEXT_PUBLIC_HOST=http://localhost:3000',
      '',
      'NEXT_PUBLIC_ISSUANCE_API_URL=https://console-vc-issuance.apse1.affinidi.com/api',
      'NEXT_PUBLIC_USER_MANAGEMENT_API_URL=https://console-user-management.apse1.affinidi.com/api',
      'NEXT_PUBLIC_VERIFIER_API_URL=https://affinity-verifier.prod.affinity-project.org/api',
      'NEXT_PUBLIC_CLOUD_WALLET_API_URL=https://cloud-wallet-api.prod.affinity-project.org/api',
      'NEXT_PUBLIC_AFFINIDI_IAM_URL=https://affinidi-iam.apse1.affinidi.com/api',
      '',
      `NEXT_PUBLIC_API_KEY_HASH=${activeProjectApiKey}`,
      `NEXT_PUBLIC_PROJECT_DID=${activeProjectDid}`,
      `NEXT_PUBLIC_PROJECT_ID=${activeProjectId}`,
    ])
  } catch (error) {
    displayOutput({
      itemToDisplay: `Failed to set up project: ${error.message}`,
      flag: flags.output,
      err: true,
    })
  }
}

export const generateApplication = async (flags: FlagsInput, timeStamp?: number): Promise<void> => {
  const { name, platform, use_case: useCase } = flags
  if (platform === Platforms.mobile) {
    throw new CliError(NotSupportedPlatform, 0, 'reference-app')
  }
  const { userId, label } = getSession()?.account
  const analyticsData: EventDTO = {
    name:
      useCase === UseCasesAppNames.portableReputation
        ? 'APP_PORT_REP_GENERATION_STARTED'
        : 'APPLICATION_GENERATION_STARTED',
    category: 'APPLICATION',
    component: 'Cli',
    uuid: userId,
    metadata: {
      appName: name,
      commandId: 'affinidi.generate-application',
      timeTaken: timeStamp ? Math.floor((Date.now() - timeStamp) / 1000) : 0,
      ...generateUserMetadata(label),
    },
  }
  CliUx.ux.action.start('Generating an application')

  try {
    switch (useCase) {
      case UseCasesAppNames.healthReferenceApp:
      case UseCasesAppNames.educationReferenceApp:
      case UseCasesAppNames.ticketingReferenceApp:
      case UseCasesAppNames.portableReputation:
        await download(UseCaseSources[useCase], name)
        await analyticsService.eventsControllerSend(analyticsData)
        break
      case UseCasesAppNames.accessWithoutOwnershipOfData:
      case UseCasesAppNames.kycKyb:
        displayOutput({ itemToDisplay: 'Not implemented yet', flag: flags.output })
        break
      default:
        throw new CliError(InvalidUseCase, 0, 'reference-app')
    }
  } catch (error) {
    throw new CliError(`Failed to generate an application: ${error.message}`, 0, 'reference-app')
  }

  await setUpProject(name, flags)
  analyticsData.name =
    useCase === UseCasesAppNames.portableReputation
      ? 'APP_PORT_REP_GENERATION_COMPLETED'
      : 'APPLICATION_GENERATION_COMPLETED'
  await analyticsService.eventsControllerSend(analyticsData)
  CliUx.ux.action.stop('\nApplication generated')

  const appPath = path.resolve(`${process.cwd()}/${name}`)
  displayOutput({
    itemToDisplay: buildGeneratedAppNextStepsMessage(name, appPath, useCase),
    flag: flags.output,
  })
}
