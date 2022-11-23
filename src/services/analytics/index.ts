import { CliError } from '../../errors'
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
    }),
  ) {}

  public eventsControllerSend = async (data: EventDTO) => {
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
}

const analyticsService = new AnalyticsService()
export { analyticsService }
