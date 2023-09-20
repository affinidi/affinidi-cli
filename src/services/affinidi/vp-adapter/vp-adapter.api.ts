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

/** Service Error Response */
export interface ServiceErrorResponse {
  /**
   * unique id for correlating this specific error to logs
   * @format uuid
   */
  debugId: string
  /** name of the error */
  name: string
  /** backwards compatible Affinidi error code */
  code: string
  /** error details */
  details?: {
    /** issue */
    issue: string
    /** fields */
    field?: string
    /** value */
    value?: string
    /** location */
    location?: string
  }[]
}

/** Redirect Response */
export interface RedirectResponse {
  /** type */
  type: 'REDIRECT_RESPONSE'
  /**
   * URL to redirect to
   * @format url
   */
  to: string
}

export interface ListLoginConfigurationOutput {
  configurations: LoginConfigurationObject[]
}

export interface CreateLoginConfigurationInput {
  /** User defined login configuration name */
  name: string
  /** OAuth 2.0 Redirect URIs */
  redirectUris: string[]
  /** VP definition in JSON stringify format */
  vpDefinition?: string
  /** Presentation Definition */
  presentationDefinition?: object
  /** Fields name/path mapping between the vp_token and the id_token */
  idTokenMapping?: IdTokenMapping
  /** login configuration client metadata */
  clientMetadata?: LoginConfigurationClientMetadata
  /** ID token claims output format. Default is array. */
  claimFormat?: 'array' | 'map'
  /** List of groups separated by space */
  scope?: string
  /** Requested Client Authentication method for the Token Endpoint. The options are: `client_secret_post`: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body. `client_secret_basic`: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP Authorization header. `none`: For public clients (native/mobile apps) which can not have secret. */
  tokenEndpointAuthMethod?: TokenEndpointAuthMethod
}

export interface CreateLoginConfigurationOutput {
  /** Configuration ari */
  ari: string
  /** Project id */
  projectId: string
  /** Configuration id */
  id: string
  /** User defined login configuration name */
  name: string
  /** OIDC Auth Credentials */
  auth: {
    /** OAuth 2.0 Client ID */
    clientId: string
    /** OAuth 2.0 Client Secret */
    clientSecret?: string
    /** OAuth 2.0 Client Scope */
    scope?: string
    /** Issuer URL */
    issuer?: string
  }
  /** OAuth 2.0 Redirect URIs */
  redirectUris: string[]
  /** login configuration client metadata */
  clientMetadata: LoginConfigurationClientMetadata
  /** OAuth 2.0 Client Creation Date */
  creationDate: string
}

export type GetLoginConfigurationOutput = LoginConfigurationObject

export interface UpdateLoginConfigurationInput {
  /** User defined login configuration name */
  name?: string
  /** OAuth 2.0 Redirect URIs */
  redirectUris?: string[]
  /** OAuth2 client secret */
  clientSecret?: string
  /** VP definition in JSON stringify format */
  vpDefinition?: string
  /** Presentation Definition */
  presentationDefinition?: object
  /** Fields name/path mapping between the vp_token and the id_token */
  idTokenMapping?: IdTokenMapping
  /** login configuration client metadata */
  clientMetadata?: LoginConfigurationClientMetadata
  /** Requested Client Authentication method for the Token Endpoint. The options are: `client_secret_post`: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body. `client_secret_basic`: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP Authorization header. `none`: For public clients (native/mobile apps) which can not have secret. */
  tokenEndpointAuthMethod?: TokenEndpointAuthMethod
}

export type UpdateLoginConfigurationOutput = LoginConfigurationObject

export interface LoginSessionDto {
  /** Session primary identifier */
  id: string
  authorizationRequest: {
    /** State parameter */
    state: string
    /** Presentation Definition to ask from the user. In JSON Stringify format. */
    presentationDefinition: string
    /** ARI is used for analytics proposals. */
    ari?: string
    /** clientId used for detect origin. */
    clientId?: string
  }
}

/** Input for Creating a Login Session */
export interface LoginSessionForIDPInput {
  /** IDP Login Challenge to Associate the Session with */
  loginChallenge: string
}

export type LoginSessionForIDPOutput = LoginSessionDto

/** Authorization Response per OpenID for Verifiable Presentations Specification */
export type LoginSessionAcceptResponseInput = Record<string, any>

/** Direct Post Response URI endpoint result */
export type LoginSessionAcceptResponseOutput = Record<string, any>

/** Authorization Response per OpenID for Verifiable Presentations Specification */
export interface LoginSessionRejectResponseInput {
  /** The error should follow the OAuth2 error format (e.g. invalid_request, login_required). Defaults to request_denied */
  error?: string
  /** Description of the error in a human readable format */
  errorDescription?: string
  /** Random state associated to the Session */
  state: string
  [key: string]: any
}

/** Direct Post Response URI endpoint result */
export type LoginSessionRejectResponseOutput = Record<string, any>

export interface LoginConfigurationObject {
  /** Configuration ari */
  ari: string
  /** Configuration id */
  id: string
  /** Project id */
  projectId: string
  /** User defined login configuration name */
  name: string
  /** OAuth 2.0 Redirect URIs */
  redirectUris?: string[]
  /** OAuth 2.0 Client Scope */
  scope?: string
  /** OAuth 2.0 Client ID */
  clientId: string
  /** OAuth 2.0 Client Creation Date */
  creationDate: string
  /** VP definition in JSON stringify format */
  vpDefinition: string
  /** Presentation Definition */
  presentationDefinition?: object
  /** Fields name/path mapping between the vp_token and the id_token */
  idTokenMapping: IdTokenMapping
  /** login configuration client metadata */
  clientMetadata: LoginConfigurationClientMetadata
  [key: string]: any
}

/**
 * Fields name/path mapping between the vp_token and the id_token
 * @minItems 1
 */
export type IdTokenMapping = {
  /** Name(path) of the corresponding field in the vp_token */
  sourceField: string
  /** Name of the corresponding field in the id_token */
  idTokenClaim: string
}[]

export interface CreateGroupInput {
  /**
   * name of the group for users, used as an id
   * @maxLength 24
   * @pattern ^[a-z_]+$
   */
  groupName: string
}

export interface GroupDto {
  /** Group ari */
  ari: string
  /** Project id */
  projectId: string
  /** name of the group, identifier within a project */
  groupName: string
  /** Group creation date */
  creationDate: string
}

export interface GroupUserMappingDto {
  /** Group user mapping ari */
  ari: string
  /** Group user mapping id */
  id: string
  /** Project id */
  projectId: string
  /** Group name */
  groupName: string
  /** Unique identifier of the user, subject of the token */
  sub: string
  /** Group to user mapping creation date */
  creationDate: string
}

/** input used to create a user group mapping or in other words add user to group */
export interface AddUserToGroupInput {
  /** Unique identifier of the user, subject of the token */
  sub: string
}

export interface GroupsList {
  groups?: GroupDto[]
}

export interface GroupUserMappingsList {
  mappings?: GroupUserMappingDto[]
}

/** login configuration client metadata */
export interface LoginConfigurationClientMetadata {
  /** application name that will be displayed in consent page */
  name: string
  /** origin url that will be displayed in consent page */
  origin: string
  /** logo url that will be displayed in consent page */
  logo: string
  [key: string]: any
}

/** Requested Client Authentication method for the Token Endpoint. The options are: `client_secret_post`: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body. `client_secret_basic`: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP Authorization header. `none`: For public clients (native/mobile apps) which can not have secret. */
export enum TokenEndpointAuthMethod {
  ClientSecretBasic = 'client_secret_basic',
  ClientSecretPost = 'client_secret_post',
  None = 'none',
}

export interface InvalidParameterError {
  name: 'InvalidParameterError'
  message: 'Invalid parameter: ${param}.'
  httpStatusCode: 400
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface NotFoundError {
  name: 'NotFoundError'
  message: 'Not found: ${param}.'
  httpStatusCode: 404
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface ResourceCreationError {
  name: 'ResourceCreationError'
  message: 'Failed to create resources.'
  httpStatusCode: 424
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface GroupsPerUserLimitExceededError {
  name: 'GroupsPerUserLimitExceededError'
  message: 'Amount of groups per user is limited.'
  httpStatusCode: 409
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface ActionForbiddenError {
  name: 'ActionForbiddenError'
  message: 'Principal can not execute action on given resource'
  httpStatusCode: 403
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface VPTokenValidationError {
  name: 'VPTokenValidationError'
  message: 'VP token validation ended with an error'
  httpStatusCode: 400
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
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

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
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
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '/' })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property]

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

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
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
 * @title OidcVpAdapterBackend
 * @version 1.0.0
 * @baseUrl /
 * @contact nucleus <nucleus.team@affinidi.com>
 *
 * Affinidi OIDC VP Adapter Backend
 *
 * An authorization token is necessary to create or obtain a project Access Token and access Admin APIs. Follow these step-by-step [instructions](https://lemmatree.atlassian.net/wiki/spaces/NETCORE/pages/2735317648020/ASA+Developer+Flow#Instructions-on-how-to-create-the-Project.)  to set up an authorization token
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * @description IDP consent request automated by adapter frontend
     *
     * @tags consent
     * @name ConsentRequest
     * @summary IDP consent request automated by adapter frontend
     * @request GET:/v1/consent/request
     */
    consentRequest: (
      query?: {
        /** Consent challenge provided by IDP */
        consent_challenge?: string
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/consent/request`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Creates Login Session for IDP Login by using the Login Challenge
     *
     * @tags session
     * @name LoginSessionForIdp
     * @summary Create Login Session for IDP Login
     * @request POST:/v1/login/sessions/for-idp
     */
    loginSessionForIdp: (data: LoginSessionForIDPInput, params: RequestParams = {}) =>
      this.request<LoginSessionForIDPOutput, ActionForbiddenError>({
        path: `/v1/login/sessions/for-idp`,
        method: 'POST',
        body: data,
        ...params,
      }),

    /**
     * @description Enable CORS by returning correct headers
     *
     * @tags cors
     * @name CorsLoginSessionForIdp
     * @summary CORS Support
     * @request OPTIONS:/v1/login/sessions/for-idp
     */
    corsLoginSessionForIdp: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/sessions/for-idp`,
        method: 'OPTIONS',
        ...params,
      }),

    /**
     * @description Accepts and Validates the OIDC VP Response sent by the Wallet
     *
     * @tags session
     * @name LoginSessionAcceptResponse
     * @summary Accept OIDC VP Response for Login Session
     * @request POST:/v1/login/sessions/{sessionId}/accept-response
     */
    loginSessionAcceptResponse: (
      sessionId: string,
      data: LoginSessionAcceptResponseInput,
      params: RequestParams = {},
    ) =>
      this.request<LoginSessionAcceptResponseOutput, InvalidParameterError | VPTokenValidationError>({
        path: `/v1/login/sessions/${sessionId}/accept-response`,
        method: 'POST',
        body: data,
        ...params,
      }),

    /**
     * @description Enable CORS by returning correct headers
     *
     * @tags cors
     * @name CorsLoginSessionAcceptResponse
     * @summary CORS Support
     * @request OPTIONS:/v1/login/sessions/{sessionId}/accept-response
     */
    corsLoginSessionAcceptResponse: (sessionId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/sessions/${sessionId}/accept-response`,
        method: 'OPTIONS',
        ...params,
      }),

    /**
     * @description The user declines the request for access to their data
     *
     * @tags session
     * @name LoginSessionRejectResponse
     * @summary Reject Response for Login Session
     * @request POST:/v1/login/sessions/{sessionId}/reject-response
     */
    loginSessionRejectResponse: (
      sessionId: string,
      data: LoginSessionRejectResponseInput,
      params: RequestParams = {},
    ) =>
      this.request<LoginSessionRejectResponseOutput, any>({
        path: `/v1/login/sessions/${sessionId}/reject-response`,
        method: 'POST',
        body: data,
        ...params,
      }),

    /**
     * @description Enable CORS by returning correct headers
     *
     * @tags cors
     * @name CorsLoginSessionRejectResponse
     * @summary CORS Support
     * @request OPTIONS:/v1/login/sessions/{sessionId}/reject-response
     */
    corsLoginSessionRejectResponse: (sessionId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/sessions/${sessionId}/reject-response`,
        method: 'OPTIONS',
        ...params,
      }),

    /**
     * @description Endpoint to retrieve list of login configurations
     *
     * @tags configuration
     * @name ListLoginConfigurations
     * @summary List login configurations
     * @request GET:/v1/login/configurations
     * @secure
     */
    listLoginConfigurations: (params: RequestParams = {}) =>
      this.request<ListLoginConfigurationOutput, InvalidParameterError | ActionForbiddenError>({
        path: `/v1/login/configurations`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Create a new login configuration `vpDefinition` and `idTokenMapping` have default settings that provide user email VP presentation definitions. An essential default definition is in place when it comes to the login process for end users using the Chrome extension. This definition requires users to input their email address as OIDCVP compliant, which is then verified by the Affinidi verification service.
     *
     * @tags configuration
     * @name CreateLoginConfigurations
     * @summary Create a new login configuration
     * @request POST:/v1/login/configurations
     * @secure
     */
    createLoginConfigurations: (data: CreateLoginConfigurationInput, params: RequestParams = {}) =>
      this.request<
        CreateLoginConfigurationOutput,
        InvalidParameterError | ActionForbiddenError | ResourceCreationError
      >({
        path: `/v1/login/configurations`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Get login configuration by ID
     *
     * @tags configuration
     * @name GetLoginConfigurationsById
     * @summary Get login configuration by ID
     * @request GET:/v1/login/configurations/{configurationId}
     * @secure
     */
    getLoginConfigurationsById: (configurationId: string, params: RequestParams = {}) =>
      this.request<GetLoginConfigurationOutput, InvalidParameterError | ActionForbiddenError>({
        path: `/v1/login/configurations/${configurationId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Update login configurations by ID
     *
     * @tags configuration
     * @name UpdateLoginConfigurationsById
     * @summary Update login configurations by ID
     * @request PATCH:/v1/login/configurations/{configurationId}
     * @secure
     */
    updateLoginConfigurationsById: (
      configurationId: string,
      data: UpdateLoginConfigurationInput,
      params: RequestParams = {},
    ) =>
      this.request<UpdateLoginConfigurationOutput, InvalidParameterError | ActionForbiddenError>({
        path: `/v1/login/configurations/${configurationId}`,
        method: 'PATCH',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete login configurations by ID
     *
     * @tags configuration
     * @name DeleteLoginConfigurationsById
     * @summary Delete login configurations by ID
     * @request DELETE:/v1/login/configurations/{configurationId}
     * @secure
     */
    deleteLoginConfigurationsById: (configurationId: string, params: RequestParams = {}) =>
      this.request<void, InvalidParameterError | ActionForbiddenError>({
        path: `/v1/login/configurations/${configurationId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Get Client Metadata By  OAuth 2.0 Client ID
     *
     * @tags configuration
     * @name GetClientMetadataByClientId
     * @summary Get Client Metadata By  OAuth 2.0 Client ID
     * @request GET:/v1/login/configurations/metadata/{clientId}
     * @secure
     */
    getClientMetadataByClientId: (clientId: string, params: RequestParams = {}) =>
      this.request<LoginConfigurationClientMetadata, InvalidParameterError | NotFoundError>({
        path: `/v1/login/configurations/metadata/${clientId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name ListGroups
     * @request GET:/v1/groups
     * @secure
     */
    listGroups: (params: RequestParams = {}) =>
      this.request<GroupsList, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name CreateGroup
     * @request POST:/v1/groups
     * @secure
     */
    createGroup: (data: CreateGroupInput, params: RequestParams = {}) =>
      this.request<GroupDto, InvalidParameterError | ActionForbiddenError | GroupsPerUserLimitExceededError>({
        path: `/v1/groups`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name GetGroupById
     * @request GET:/v1/groups/{groupName}
     * @secure
     */
    getGroupById: (groupName: string, params: RequestParams = {}) =>
      this.request<GroupDto, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups/${groupName}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name DeleteGroup
     * @request DELETE:/v1/groups/{groupName}
     * @secure
     */
    deleteGroup: (groupName: string, params: RequestParams = {}) =>
      this.request<void, InvalidParameterError | ActionForbiddenError>({
        path: `/v1/groups/${groupName}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name ListGroupUserMappings
     * @request GET:/v1/groups/{groupName}/users
     * @secure
     */
    listGroupUserMappings: (groupName: string, params: RequestParams = {}) =>
      this.request<GroupUserMappingsList, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups/${groupName}/users`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name AddUserToGroup
     * @request POST:/v1/groups/{groupName}/users
     * @secure
     */
    addUserToGroup: (groupName: string, data: AddUserToGroupInput, params: RequestParams = {}) =>
      this.request<GroupUserMappingDto, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups/${groupName}/users`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags group
     * @name RemoveUserFromGroup
     * @request DELETE:/v1/groups/{groupName}/users/{groupUserMappingId}
     * @secure
     */
    removeUserFromGroup: (groupName: string, groupUserMappingId: string, params: RequestParams = {}) =>
      this.request<void, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups/${groupName}/users/${groupUserMappingId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @name LoginAdminProxyList
     * @request GET:/v1/login/admin/{proxy+}
     */
    loginAdminProxyList: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/admin/{proxy+}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name LoginAdminProxyCreate
     * @request POST:/v1/login/admin/{proxy+}
     */
    loginAdminProxyCreate: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/admin/{proxy+}`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name LoginAdminProxyDelete
     * @request DELETE:/v1/login/admin/{proxy+}
     */
    loginAdminProxyDelete: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/admin/{proxy+}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @name LoginAdminProxyUpdate
     * @request PUT:/v1/login/admin/{proxy+}
     */
    loginAdminProxyUpdate: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/admin/{proxy+}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @name LoginAdminProxyPartialUpdate
     * @request PATCH:/v1/login/admin/{proxy+}
     */
    loginAdminProxyPartialUpdate: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/admin/{proxy+}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name LoginProxyList
     * @request GET:/v1/login/{proxy+}
     */
    loginProxyList: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/{proxy+}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags idp
     * @name LoginProxyCreate
     * @request POST:/v1/login/{proxy+}
     */
    loginProxyCreate: (proxy: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/{proxy+}`,
        method: 'POST',
        ...params,
      }),
  }
}
