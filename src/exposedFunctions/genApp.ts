import { CliUx } from '@oclif/core'
import path from 'path'

import { analyticsService, generateUserMetadata } from '../services/analytics'
import { ViewFormat } from '../constants'
import { CliError, InvalidUseCase, NotSupportedPlatform, Unauthorized } from '../errors'
import { displayOutput } from '../middleware/display'
import { getSession } from '../services/user-management'
import { EventDTO } from '../services/analytics/analytics.api'
import { buildGeneratedAppNextStepsMessage } from '../render/texts'
import { GitService, Writer } from '../services'

export interface FlagsInput {
  platform?: PlatformType
  name?: string
  use_case?: UseCaseType
  withProxy?: boolean
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
  certificationAndVerification = 'certification-and-verification',
  kycKyb = 'kyc-kyb',
}

type UseCaseType = `${UseCasesAppNames}`
type PlatformType = `${Platforms}`

const UseCaseSources: Record<UseCaseType, string> = {
  'portable-reputation': 'NOT IMPLEMENTED YET',
  'access-without-ownership-of-data': 'NOT IMPLEMENTED YET',
  'certification-and-verification':
    'https://github.com/affinidi/elements-reference-app-frontend.git',
  'kyc-kyb': 'NOT IMPLEMENTED YET',
}

const download = async (gitUrl: string, destination: string): Promise<void> => {
  try {
    await GitService.clone(gitUrl, destination)
  } catch (error) {
    throw Error(`Download Failed: ${error.message}`)
  }
}

const setUpProject = async (name: string, withProxy: boolean, flags: FlagsInput): Promise<void> => {
  const { apiKey, projectDid, projectId } = flags

  const activeProjectApiKey = apiKey
  const activeProjectDid = projectDid
  const activeProjectId = projectId

  if (!activeProjectApiKey || !activeProjectDid || !activeProjectId) {
    throw Error(Unauthorized)
  }

  displayOutput({ itemToDisplay: `Setting up the project`, flag: flags.output })

  try {
    if (withProxy) {
      Writer.write(path.join(name, '.env'), [
        'VITE_CLOUD_WALLET_URL=http://localhost:8080/cloud-wallet',
        'VITE_VERIFIER_URL=http://localhost:8080/affinity-verifier',
        'VITE_USER_MANAGEMENT_URL=http://localhost:8080/user-management',
        'VITE_ISSUANCE_URL=http://localhost:8080/console-vc-issuance',
      ])

      Writer.write(path.join(`${name}-backend`, '.env'), [
        'HOST=127.0.0.1',
        'PORT=8080',
        'NODE_ENV=dev',
        'ENVIRONMENT=development',
        'FRONTEND_HOST=http://localhost:3000',

        `API_KEY_HASH=${activeProjectApiKey}`,
        `ISSUER_DID=${activeProjectDid}`,
        `PROJECT_ID=${activeProjectId}`,
      ])

      return
    }

    Writer.write(path.join(name, '.env'), [
      'VITE_CLOUD_WALLET_URL=https://cloud-wallet-api.prod.affinity-project.org',
      'VITE_VERIFIER_URL=https://affinity-verifier.prod.affinity-project.org',
      'VITE_USER_MANAGEMENT_URL=https://console-user-management.apse1.affinidi.com',
      'VITE_ISSUANCE_URL=https://console-vc-issuance.apse1.affinidi.com',
      'VITE_IAM_URL=https://affinidi-iam.apse1.affinidi.com',

      `VITE_API_KEY=${activeProjectApiKey}`,
      `VITE_PROJECT_DID=${activeProjectDid}`,
      `VITE_PROJECT_ID=${activeProjectId}`,
    ])
  } catch (error) {
    displayOutput({
      itemToDisplay: `Failed to set up project: ${error.message}`,
      flag: flags.output,
      err: true,
    })
  }
}

export const generateApplication = async (flags: FlagsInput): Promise<void> => {
  const { name, platform, use_case: useCase, withProxy } = flags
  if (platform === Platforms.mobile) {
    throw new CliError(NotSupportedPlatform, 0, 'reference-app')
  }
  const userId = getSession()?.account?.userId
  const analyticsData: EventDTO = {
    name: 'APPLICATION_GENERATION_STARTED',
    category: 'APPLICATION',
    component: 'Cli',
    uuid: userId,
    metadata: {
      appName: name,
      commandId: 'affinidi.generate-application',
      ...generateUserMetadata(userId),
    },
  }

  CliUx.ux.action.start('Generating an application')

  try {
    switch (useCase) {
      case UseCasesAppNames.certificationAndVerification:
        await download(UseCaseSources[useCase], name)
        await analyticsService.eventsControllerSend(analyticsData)
        break
      case UseCasesAppNames.accessWithoutOwnershipOfData:
      case UseCasesAppNames.portableReputation:
      case UseCasesAppNames.kycKyb:
        displayOutput({ itemToDisplay: 'Not implemented yet', flag: flags.output })
        break
      default:
        throw new CliError(InvalidUseCase, 0, 'reference-app')
    }
  } catch (error) {
    throw new CliError(`Failed to generate an application: ${error.message}`, 0, 'reference-app')
  }

  try {
    if (withProxy) {
      await download(
        'https://github.com/affinidi/elements-reference-app-backend.git',
        `${name}-backend`,
      )
    }
  } catch (error) {
    displayOutput({
      itemToDisplay: `Failed to generate an application: ${error.message}`,
      flag: flags.output,
      err: true,
    })
    return
  }

  await setUpProject(name, withProxy, flags)
  analyticsData.name = 'APPLICATION_GENERATION_COMPLETED'
  await analyticsService.eventsControllerSend(analyticsData)
  CliUx.ux.action.stop('\nApplication generated')

  const appPath = path.resolve(`${process.cwd()}/${name}`)
  displayOutput({
    itemToDisplay: buildGeneratedAppNextStepsMessage(name, appPath, withProxy),
    flag: flags.output,
  })
}
