import { exportSPKI, generateKeyPair } from 'jose'
import { BaseCommand } from '../common'

export class Start extends BaseCommand<typeof Start> {
  static summary = 'jose to Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const { publicKey } = await generateKeyPair('PS256')
    const exported = await exportSPKI(publicKey)
    console.log('exported:', exported)
    // const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    //   modulusLength: 4096,
    //   publicKeyEncoding: {
    //     type: 'spki',
    //     format: 'pem',
    //   },
    //   privateKeyEncoding: {
    //     type: 'pkcs8',
    //     format: 'pem',
    //     cipher: 'aes-256-cbc',
    //     passphrase: randomBytes(20).toString('hex'),
    //   },
    // })
    // console.log('{ publicKey, privateKey }:', { publicKey, privateKey })
    // console.log('stringified publicKey:', JSON.stringify({ publicKey: exported }))
    // base64url.encode(publicKey.)
    // const secret = base64url.decode(publicKey)
    // const jwt =
    //   'eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..MB66qstZBPxAXKdsjet_lA.WHbtJTl4taHp7otOHLq3hBvv0yNPsPEKHYInmCPdDDeyV1kU-f-tGEiU4FxlSqkqAT2hVs8_wMNiQFAzPU1PUgIqWCPsBrPP3TtxYsrtwagpn4SvCsUsx0Mhw9ZhliAO8CLmCBQkqr_T9AcYsz5uZw.7nX9m7BGUu_u1p1qFHzyIg'
    // const { payload, protectedHeader } = await jwtDecrypt(jwt, secret, {
    //   issuer: 'urn:example:issuer',
    //   audience: 'urn:example:audience',
    // })
    // console.log(protectedHeader)
    // console.log(payload)
  }
}

// POST /enthis-endpoint

// {body: {
//   publicKey: string
// }
// }

// BEGING PUBLIC KEY
