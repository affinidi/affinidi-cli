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

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '/api/v1'
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
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
