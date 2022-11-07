import {
  Api as IssuanceAPI,
  CreateIssuanceInput,
  CreateIssuanceOfferInput,
  CreateIssuanceOutput,
  OfferDto,
} from './issuance.api'

export const ISSUANCE_URL = 'https://console-vc-issuance.prod.affinity-project.org/api/v1'

class IssuanceService {
  constructor(
    private readonly client = new IssuanceAPI({
      baseURL: ISSUANCE_URL,
      withCredentials: true,
    }),
  ) {}

  public createIssuance = async (
    apiKey: string,
    token: string,
    issuanceInput: CreateIssuanceInput,
  ): Promise<CreateIssuanceOutput> => {
    try {
      const resp = await this.client.issuances.createIssuance(issuanceInput, {
        headers: { Cookie: token, 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error) {
      throw new Error(error?.message)
    }
  }

  public createOffer = async (
    apiKey: string,
    token: string,
    issuanceId: string,
    offerInput: CreateIssuanceOfferInput,
  ): Promise<OfferDto> => {
    try {
      const resp = await this.client.issuances.createOffer(issuanceId, offerInput, {
        headers: { Cookie: token, 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}

const issuanceService = new IssuanceService()

export { issuanceService }
