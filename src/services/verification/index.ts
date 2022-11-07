import { Api as VerifierApi, VerifyCredentialInput } from './verifier.api'

export const VERIFIER_URL = 'https://affinity-verifier.prod.affinity-project.org/api/v1'
class VerifierService {
  constructor(
    private readonly client = new VerifierApi({
      baseURL: VERIFIER_URL,
      withCredentials: true,
    }),
  ) {}

  public verifyVC = async (apiKey: string, verifyVCInput: VerifyCredentialInput) => {
    try {
      const resp = await this.client.verifier.verifyCredentials(verifyVCInput, {
        headers: { 'Api-Key': apiKey },
      })
      return resp.data
    } catch (error) {
      throw new Error(error?.message)
    }
  }
}

const verfierService = new VerifierService()
export { verfierService }
