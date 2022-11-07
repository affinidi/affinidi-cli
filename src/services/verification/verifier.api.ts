/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ValidateJwtOutput {
  isValid: boolean
  payload: any
}

export interface ValidateJwtInput {
  token: string
}

export type FreeFormObject = Record<string, any>

export type SignedCredential = FreeFormObject

export interface VerifyCredentialShareResponseOutput {
  jti: string
  errors: string[]
  issuer: string
  isValid: boolean
  suppliedCredentials: SignedCredential[]
}

export interface VerifyCredentialShareResponseInput {
  credentialShareRequestToken?: string | null
  credentialShareResponseToken: string
  isHolderMustBeSubject?: boolean | null
}

export interface VerifyCredentialOutput {
  errors: string[]
  isValid: boolean
}

export interface W3CCredentialStatus {
  id: string
  type: string
  revocationListIndex: string
  revocationListCredential: string
}

export interface W3CProof {
  type?: string | null
  created?: string | null
  verificationMethod: string
  proofPurpose: string
  jws?: string | null
  proofValue?: string | null
  nonce?: string | null
}

export interface W3CCredential {
  '@context': any
  id?: string | null
  type: string[]
  holder?: FreeFormObject | null
  credentialSubject: FreeFormObject
  credentialStatus?: W3CCredentialStatus | null
  issuanceDate: string
  issuer: string
  expirationDate?: string | null
  proof: W3CProof
  credentialSchema?: {
    type: string
    id: string
  }
}

export interface VerifyCredentialInput {
  verifiableCredentials: W3CCredential[]
  issuerDidDocument?: FreeFormObject
}

export interface VerifyPresentationOutput {
  error?: string
  errors?: string[]
  isValid: boolean
}

export interface W3CPresentation {
  '@context': any
  id?: string | null
  type: string[]
  holder: FreeFormObject
  verifiableCredential: W3CCredential[]
  proof: FreeFormObject
}

export interface VerifyPresentationInput {
  verifiablePresentation?: W3CPresentation
  signedPresentation?: W3CPresentation
}

export interface BuildCredentialRequestOutput {
  credentialShareRequest: FreeFormObject
}

/**
 * @pattern ^https?:\/\/.*$
 */
export type UrlType = string

export interface CredentialRequirements {
  type: string[]
  constraints?: string[] | Record<string, any[]>[] | (string[] & Record<string, any[]>[])
}

/**
 * @pattern did:.*
 */
export type DidType = string

/**
 * @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)
 */
export type DateISOType = string

export interface BuildCredentialRequestInput {
  callbackUrl?: UrlType | null
  credentialRequirements: CredentialRequirements[]
  issuerDid?: DidType | null
  subjectDid?: DidType | null
  audienceDid?: DidType | null
  expiresAt?: DateISOType | null
  nonce?: string | null
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '/api/v1' })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: Iterable<any> = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title affinity-verifier
 * @version 0.28.1
 * @license ISC
 * @baseUrl /api/v1
 * @contact Denis Popov  <denis.p@affinity-project.org>
 *
 * Affinity verifier
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  verifier = {
    /**
     * @description Validates JWT object. returns isValid: boolean payload: payload from JWT
     *
     * @tags Verifier
     * @name ValidateJwt
     * @request POST:/verifier/validate-jwt
     */
    validateJwt: (data: ValidateJwtInput, params: RequestParams = {}) =>
      this.request<ValidateJwtOutput, void>({
        path: `/verifier/validate-jwt`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Verifying JWT token (signature and expiration), validate each credential inside it (signature), validate response against request if requestToken was passed. `errors` contains list of error messages for invalid credentials.
     *
     * @tags Verifier
     * @name VerifyCredentialShareResponse
     * @summary Verifying share response token.
     * @request POST:/verifier/verify-share-response
     */
    verifyCredentialShareResponse: (
      data: VerifyCredentialShareResponseInput,
      params: RequestParams = {},
    ) =>
      this.request<VerifyCredentialShareResponseOutput, any>({
        path: `/verifier/verify-share-response`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Verifying Verifiable Credentials (signatures) `isValid` - true if all credentials verified `errors` contains list of error messages for invalid credentials.
     *
     * @tags Verifier
     * @name VerifyCredentials
     * @summary Verifying VC
     * @request POST:/verifier/verify-vcs
     */
    verifyCredentials: (data: VerifyCredentialInput, params: RequestParams = {}) =>
      this.request<VerifyCredentialOutput, any>({
        path: `/verifier/verify-vcs`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Verifying Verifiable Presentation (signatures) `isValid` - true if presentation verified `error` verificaction error.
     *
     * @tags Verifier
     * @name VerifyPresentation
     * @summary Verifying VP
     * @request POST:/verifier/verify-vp
     */
    verifyPresentation: (data: VerifyPresentationInput, params: RequestParams = {}) =>
      this.request<VerifyPresentationOutput, any>({
        path: `/verifier/verify-vp`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Build credential share request JWT object from input data.
     *
     * @tags Verifier
     * @name BuildCredentialRequest
     * @summary Builds credential share request.
     * @request POST:/verifier/build-credential-request
     */
    buildCredentialRequest: (data: BuildCredentialRequestInput, params: RequestParams = {}) =>
      this.request<BuildCredentialRequestOutput, any>({
        path: `/verifier/build-credential-request`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
}
