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

export interface EventDTO {
  /** @example Did Created */
  name:
    | 'Did Created'
    | 'Did Updated'
    | 'Did Resolved'
    | 'VC Verified'
    | 'VC Verified per party'
    | 'VC Saved'
    | 'VC Signed'
    | 'VC Revoked'
    | 'VC Issue Initiated'
    | 'VC Validated'
    | 'VC offer response verified'
    | 'VC share response verified'
    | 'Shared Message Created'
    | 'VP Signed'
    | 'VP Verified'
    | 'VP Signed JWT'
    | 'VP Verified JWT'
    | 'User Onboarded'
    | 'JWT Validated'
    | 'API called from affinidi common backend'
    | ' Create DID auth response token through cloud wallet'
    | 'Verify DID auth response token'
    | 'Make VC revocable'
    | 'Create credential offer response token'
    | 'Streaming service put record'
    | 'Get Credential Offer'
    | 'Create Did Auth Request'
    | 'Get credentials'
    | 'Search credentials'
    | 'Delete credentials'
    | 'Get Revocation List Credential'
    | 'Publish Revocation List Credential'
    | 'Build Revocation List Status'
    | 'Create Message Template'
    | 'Delete Message Template'
    | 'Get Signed Credentials'
    | 'Read User Key'
    | 'Store User Key'
    | 'Confirm User'
    | 'Delete User'
    | 'SIGN_JWT'
    | 'USER_SIGN_UP'
    | 'GET_USER_DID'
    | 'USER_CONFIRM_SIGN_UP'
    | 'USER_LOGIN'
    | 'USER_PASSWORDLESS_LOGIN'
    | 'USER_PASSWORDLESS_LOGIN_CONFIRM'
    | 'USER_LOGOUT'
    | 'USER_FORGOT_PASSWORD'
    | 'USER_FORGOT_PASSWORD_CONFIRM'
    | 'USER_CHANGE_USERNAME'
    | 'USER_CHANGE_USERNAME_CONFIRM'
    | 'USER_CHANGE_PASSWORD'
    | 'USER_SIGN_IN'
    | 'USER_SIGN_IN_CONFIRM'
    | 'GET_SHARED_CREDENTIAL'
    | 'GET_CREDENTIALS'
    | 'GET_CREDENTIAL'
    | 'SHARE_CREDENTIAL'
    | 'SAVE_CREDENTIALS'
    | 'DELETE_CREDENTIAL'
    | 'SIGN_CREDENTIAL'
    | 'SIGN_PRESENTATION'
    | 'CREATE_CRED_SHARE_REQUEST_TOKEN'
    | 'CREATE_CREDENTIAL_SHARE_RESPONSE_TOKEN'
    | 'BLOOM_VAULT_READ'
    | 'BLOOM_VAULT_WRITE'
    | 'BULK_VC_ISSUED'
    | 'CONSOLE_USER_SIGN_UP'
    | 'CONSOLE_USER_SIGN_IN'
    | 'CONSOLE_USER_SIGN_OUT'
    | 'CONSOLE_PROJECT_CREATED'
    | 'CONSOLE_PROJECT_READ'
    | 'CONSOLE_PROJECT_SET_ACTIVE'
    | 'CONSOLE_PROJECTS_READ'
    | 'CONSOLE_API_KEY_CREATED'
    | 'VC_SCHEMA_CREATED'
    | 'VC_SCHEMAS_SEARCHED'
    | 'VC_SCHEMAS_READ'
    | 'CREATE_SHARED_MESSAGE'
    | 'INDEX_MY_SHARED_MESSAGE'
    | 'READ_SHARED_MESSAGE'
    | 'PULL_MY_MESSAGES'
    | 'SEND_MESSAGE'
    | 'DELETE_MY_MESSAGE'
    | 'CLAIM_CREDENTIALS'
    | 'RULES_SET_INVOKED'
    | 'RULES_ACCOUNT_CREATED'
    | 'RULES_ACCOUNT_UPDATED'
    | 'RULES_ACCOUNT_DELETED'
    | 'RULES_SET_CREATED'
    | 'RULES_SET_PUBLISHED'
    | 'RULES_SET_UNPUBLISHED'
    | 'RULE_CREATED'
    | 'RULE_UPDATED'
    | 'COMMAND_EXECUTED'
    | 'SNIPPET_INSERTED'
    | 'EXTENSION_INITIALIZED'
    | 'APPLICATION_GENERATION_STARTED'
    | 'APPLICATION_GENERATION_COMPLETED'
  /** @example APPLICATION */
  category: 'DID' | 'VC' | 'VP' | 'APPLICATION' | 'JWT'
  subCategory?: string
  /** @example NotImplemented */
  component:
    | 'AffinityWalletExpoSDK'
    | 'AffinidiRegistry'
    | 'AffinidiBrowserWalletSDK'
    | 'AffinidiExpoWalletSDK'
    | 'AffinidiReactNativeWalletSDK'
    | 'AffinidiCloudWalletAPI'
    | 'AffinidiOnboarding'
    | 'AffinidiCommon'
    | 'AffinidiCore'
    | 'AffinidiRevocation'
    | 'AffinidiCommonBackend'
    | 'AffinidiDidAuthLib'
    | 'AffinidiUtilityApi'
    | 'AffinidiCaregiver'
    | 'AffinidiHealthPassVerifier'
    | 'AffinidiSffIssuer'
    | 'AffinidiVerifier'
    | 'AffinidiIssuer'
    | 'AffinidiCommonNetwork'
    | 'AffinidiWalletBackend'
    | 'AffinidiVault'
    | 'AffinidiCloudWalletApi'
    | 'AffinidiVaultMigrationService'
    | 'AffinidiByoRegistry'
    | 'AffinidiSchemaManager'
    | 'ConsoleVCIssuance'
    | 'SFFIssuer'
    | 'AffinidiMessages'
    | 'ConsentManagementBackend'
    | 'RuleEngineV3Monolith'
    | 'RulesManager'
    | 'PaperCheckingApi'
    | 'PaperVerificationBackend'
    | 'OCREngine'
    | 'OCREngineServerless'
    | 'UniversalQrReader'
    | 'MultifierPluginsService'
    | 'HealthPassportVerifierGateway'
    | 'CommonCheckPaymentsBackend'
    | 'PluginService'
    | 'NotImplemented'
    | 'AffinidiBulkIssuance'
    | 'AffinidiUserManagement'
    | 'AffinidiIAM'
    | 'VsCodeExtension'
    | 'Cli'
  uuid: string
  metadata?: object
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
  public baseUrl: string = ''
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
 * @title Analytics-stream
 * @version 1.0
 * @contact
 *
 * Analytics-Stream API documentation
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  health = {
    /**
     * No description
     *
     * @name AppControllerCreate
     * @request GET:/health
     */
    appControllerCreate: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/health`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  api = {
    /**
     * No description
     *
     * @tags Events
     * @name EventsControllerSend
     * @request POST:/api/events
     */
    eventsControllerSend: (data: EventDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/events`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
}
