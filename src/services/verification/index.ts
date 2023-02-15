import { CliError } from '../../errors'
import { Api as VerifierApi, VerifyCredentialInput, VerifyCredentialOutput } from './verifier.api'

export const VERIFIER_URL =
  process.env.NODE_ENV === 'test'
    ? 'https://affinity-verifier.staging.affinity-project.org/api/v1'
    : 'https://affinity-verifier.prod.affinity-project.org/api/v1'
const SERVICE = 'verification'

class VerifierService {
  constructor(
    private readonly client = new VerifierApi({
      baseURL: VERIFIER_URL,
      withCredentials: true,
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }),
  ) {}

  public verifyVC = async (
    apiKey: string,
    verifyVCInput: VerifyCredentialInput,
  ): Promise<VerifyCredentialOutput> => {
    try {
      const resp = await this.client.verifier.verifyCredentials(verifyVCInput, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }
}

const verifierService = new VerifierService()
export { verifierService }
