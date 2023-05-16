import FormData from 'form-data'
import { CliError } from '../../errors'
import {
  Api as IssuanceAPI,
  CreateIssuanceInput,
  CreateIssuanceOfferInput,
  CreateIssuanceOutput,
  OfferDto,
} from './issuance.api'
import { BulkApi } from './bulkIssuance.api'

export const ISSUANCE_URL = 'https://console-vc-issuance.apse1.affinidi.com/api/v1'

const SERVICE = 'issuance'

class IssuanceService {
  constructor(
    private readonly client = new IssuanceAPI({
      baseURL: ISSUANCE_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
    private readonly bulkClient = new BulkApi({
      baseURL: ISSUANCE_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public createIssuance = async (
    apiKey: string,
    issuanceInput: CreateIssuanceInput,
  ): Promise<CreateIssuanceOutput> => {
    try {
      const resp = await this.client.issuances.createIssuance(issuanceInput, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public createOffer = async (
    apiKey: string,
    issuanceId: string,
    offerInput: CreateIssuanceOfferInput,
  ): Promise<OfferDto> => {
    try {
      const resp = await this.client.issuances.createOffer(issuanceId, offerInput, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public createFromCsv = async (apiKey: string, data: FormData): Promise<CreateIssuanceOutput> => {
    try {
      const resp = await this.bulkClient.bulkIssuances.createFromCsvFile(data, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data.issuance
    } catch (error: any) {
      throw new CliError(error?.message, error.response?.status, SERVICE)
    }
  }
}

const issuanceService = new IssuanceService()

export { issuanceService }
