import { CLIError } from '@oclif/core/lib/errors'
import axios from 'axios'

export function getAppName(framework: string, provider: string, library: string) {
  return `${provider}-${framework}-${library}`
}

export async function getApps(filePath: string): Promise<object> {
  const githubFileUrl = `https://api.github.com/repos/affinidi/reference-app-affinidi-vault/contents/${filePath}`

  try {
    const response = await axios.get(githubFileUrl)
    if (response.data && response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8')
      const apps = JSON.parse(content)

      return apps
    }

    throw new CLIError('Unable to fetch supported apps')
  } catch (err) {
    throw new CLIError('Unable to fetch supported apps')
  }
}

export function getSupportedSampleApps(appsInformation: object) {
  return Object.keys(appsInformation)
}

export function getSupportedProviders(sampleApps: string[]) {
  try {
    const providers: string[] = []
    for (const sampleApp of sampleApps) {
      const nameSplit = sampleApp.split('-')
      if (!providers.includes(nameSplit[0])) {
        providers.push(nameSplit[0])
      }
    }

    return providers
  } catch (err) {
    throw new CLIError('Unable to fetch supported providers')
  }
}

export function getSupportedFrameworks(sampleApps: string[]) {
  try {
    const frameworks: string[] = []
    for (const sampleApp of sampleApps) {
      const nameSplit = sampleApp.split('-')
      if (!frameworks.includes(nameSplit[1])) {
        frameworks.push(nameSplit[1])
      }
    }

    return frameworks
  } catch (err) {
    throw new CLIError('Unable to fetch supported frameworks')
  }
}

export function getSupportedLibraries(sampleApps: string[]) {
  try {
    const libraries: Map<string, string[]> = new Map()
    for (const sampleApp of sampleApps) {
      const nameSplit = sampleApp.split('-')
      const provider = nameSplit[0]
      const framework = nameSplit[1]
      const libNames = libraries.get(`${provider}-${framework}`)
      if (!libNames) {
        libraries.set(`${provider}-${framework}`, [nameSplit[2]])
      } else if (!libNames.includes(nameSplit[2])) {
        libNames.push(nameSplit[2])
        libraries.set(`${provider}-${framework}`, libNames)
      }
    }

    return libraries
  } catch (err) {
    throw new CLIError('Unable to fetch supported libraries')
  }
}

export function getSupportedAppsInformation(apps: object) {
  const sampleApps = getSupportedSampleApps(apps)
  const providers = getSupportedProviders(sampleApps)
  const frameworks = getSupportedFrameworks(sampleApps)
  const libraries = getSupportedLibraries(sampleApps)

  return { providers, frameworks, libraries }
}
