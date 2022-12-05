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
    | 'CLI_VIEW_FORMAT_CONFIGURED'
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
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' })
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
