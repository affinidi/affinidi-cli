import { CliError } from '../../errors'
import { configService } from '../config'
import { Api as AnalyticsApi, EventDTO } from './analytics.api'

export const ANALYTICS_URL = 'https://analytics-stream.prod.affinity-project.org'
const SERVICE = 'analytics'

const INTERNAL_DOMAINS = ['affinidi.com', 'trustana.com', 'goodworker.in', 'lemmatree.com']
export const generateUserMetadata = (userEmail: string | undefined) => {
  if (!userEmail) {
    return {}
  }

  const domain = userEmail.split('@')[1]
  const isUserInternal = INTERNAL_DOMAINS.includes(domain)
  const internalUserVertical = isUserInternal ? domain : undefined

  return {
    isUserInternal,
    internalUserVertical,
  }
}

class AnalyticsService {
  constructor(
    private readonly client = new AnalyticsApi({
      baseURL: ANALYTICS_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public hasOptedInOrOut(): boolean {
    return [false, true].includes(configService.hasAnalyticsOptIn())
  }

  public hasAnalyticsOptIn(): boolean {
    return configService.hasAnalyticsOptIn()
  }

  public setAnalyticsOptIn(value: boolean): void {
    return configService.optInOrOut(value)
  }

  public eventsControllerSend = async (data: EventDTO) => {
    if (!this.hasAnalyticsOptIn()) {
      return
    }
    if (process.env.NODE_ENV === 'test') {
      return
    }

    try {
      // TODO: this toke is going to expire in 180 days, generate new one before it expires. Created on 22/11/2022.
      const JWT_TOKEN =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OWIwN2ZjOS0yZjlhLTRjNDUtOThhZi0xYjcwMzM1Nzg2Y2EiLCJ1c2VyTmFtZSI6ImRlbmlzLmRAYWZmaW5pZGkuY29tIiwiaWF0IjoxNjY5MTE0MjYwLCJleHAiOjE2ODQ2NjYyNjB9.zaRR6e4_Np6kJGqLKsatz2iovtoeZTxcgQgvYdycm9g'
      await this.client.api.eventsControllerSend(data, {
        headers: { authorization: `Bearer ${JWT_TOKEN}` },
      })
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public sendEnabledEvent = async (email: string, enabled: boolean, commandId: string) => {
    const analyticsData: EventDTO = {
      name: 'CLI_ANALYTICS_ENABLED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: configService.getCurrentUser(),
      metadata: {
        commandId: commandId,
        enabled,
        ...generateUserMetadata(email),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
  }
}

const analyticsService = new AnalyticsService()
export { analyticsService }
