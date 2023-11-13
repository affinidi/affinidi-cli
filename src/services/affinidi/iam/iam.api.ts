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
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface UserDto {
  principalId: string
}

export interface TypedPricipalId {
  principalId: string
}

export interface AddUserToProjectInput {
  principalId: string
  principalType: string
}

export interface CreateProjectScopedTokenInput {
  projectId: string
}

export interface CreateProjectScopedTokenOutput {
  accessToken: string
  expiresIn: number
  scope: string
}

export interface ProjectDto {
  id: string
  name: string
  description?: string
  /** creation date and time in ISO-8601 format, e.g. 2023-09-20T07:12:13 */
  createdAt?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface ProjectList {
  projects: ProjectDto[]
}

export interface UserList {
  records: UserDto[]
}

export interface PolicyStatementDto {
  action: string[]
  effect: string
  principal: string[]
  resource: string[]
}

export interface WhoamiDto {
  principalId: string
  principalType: string
}

export interface PolicyDto {
  principalId?: string
  projectId?: string
  version: string
  statement: PolicyStatementDto[]
}

export interface JsonWebKeyDto {
  kid: string
  kty: string
  n?: string
  e?: string
  x?: string
  y?: string
  crv?: string
  alg: string
  use: string
}

export interface JsonWebKeySetDto {
  /** @minItems 1 */
  keys: JsonWebKeyDto[]
}

/**
 * Private Key JWT Authentication of Client with `private_key_jwt` oAuth Method
 * @example "{"type": "PRIVATE_KEY", "signingAlgorithm": "RS256", "publicKeyInfo": { "jwks": {"keys":[{"use":"sig","kty":"RSA","kid":"some-kid","alg":"RS256","n":"some-n-value","e":"some-e-value"}]} }}"
 */
export interface TokenPrivateKeyAuthenticationMethodDto {
  type: 'PRIVATE_KEY'
  signingAlgorithm: 'RS256' | 'RS512' | 'ES256' | 'ES512'
  /** Corresponding Public Key Info provided either as a URL or a Hardcoded Object */
  publicKeyInfo:
    | {
        jwks: JsonWebKeySetDto
      }
    | {
        /** @format url */
        jwksUri: string
      }
}

/** How the Token will be authenticate against our Authorization Server */
export type TokenAuthenticationMethodDto = TokenPrivateKeyAuthenticationMethodDto

export interface TokenDto {
  /**
   * Token Id
   * @format uuid
   * @example "c5817ea6-8367-4458-9131-54cd2c5b9b48"
   */
  id: string
  /**
   * Token ARI
   * @example "token/c5817ea6-8367-4458-9131-54cd2c5b9b48"
   */
  ari: string
  /**
   * The Token owner's ARI
   * @example "ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc"
   */
  ownerAri: string
  /**
   * Owner defined Token display name
   * @example "AIV/Concierge API - affinidi-elements-iam-dev"
   */
  name: string
  /** How the Token will be authenticate against our Authorization Server */
  authenticationMethod: TokenAuthenticationMethodDto
  /** Scopes that will be assigned to the Token on authentication */
  scopes: string[]
}

export interface TokenList {
  tokens: TokenDto[]
}

export interface CreateTokenInput {
  /**
   * @pattern .{3,}
   * @example "AIV/Concierge API - affinidi-elements-iam-dev"
   */
  name: string
  /** How the Token will be authenticate against our Authorization Server */
  authenticationMethod: TokenAuthenticationMethodDto
}

export interface UpdateTokenInput {
  /**
   * @pattern .{3,}
   * @example "AIV/Concierge API - affinidi-elements-iam-dev"
   */
  name: string
  /** How the Token will be authenticate against our Authorization Server */
  authenticationMethod: TokenAuthenticationMethodDto
}

export interface UnexpectedError {
  name: 'UnexpectedError'
  message: 'Unexpected Error Occurred.'
  httpStatusCode: 500
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
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

export interface PrincipalDoesNotBelongToProjectError {
  name: 'PrincipalDoesNotBelongToProjectError'
  message: 'Principal does not belong to the given project'
  httpStatusCode: 403
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

export interface ConsumerAuthTokenEndpointInput {
  grant_type: string
  code?: string
  refresh_token?: string
  redirect_uri?: string
  client_id?: string
  [key: string]: any
}

export interface ConsumerAuthTokenEndpointOutput {
  /** The access token issued by the authorization server. */
  access_token?: string
  /**
   * The lifetime in seconds of the access token. For
   * example, the value "3600" denotes that the access token will
   * expire in one hour from the time the response was generated.
   * @format int64
   */
  expires_in?: number
  /**
   * To retrieve a refresh token request the id_token scope.
   * @format int64
   */
  id_token?: number
  /**
   * The refresh token, which can be used to obtain new
   * access tokens. To retrieve it add the scope "offline" to your access token request.
   */
  refresh_token?: string
  /** The scope of the access token */
  scope?: string
  /** The type of the token issued */
  token_type?: string
}

export interface InvalidJwtTokenError {
  name: 'InvalidJwtTokenError'
  message: 'JWT token is invalid'
  httpStatusCode: 401
  traceId: string
  details?: {
    issue: string
    field?: string
    value?: string
    location?: string
  }[]
}

export interface UnauthorizedError {
  name: 'UnauthorizedError'
  message: 'Unauthorized'
  httpStatusCode: 403
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
 * @title Iam
 * @version 1.0.0
 * @baseUrl /
 * @contact nucleus <nucleus.team@affinidi.com>
 *
 * Affinidi IAM
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  wellKnown = {
    /**
     * No description
     *
     * @tags well-known
     * @name GetWellKnownJwks
     * @request GET:/.well-known/jwks.json
     */
    getWellKnownJwks: (params: RequestParams = {}) =>
      this.request<JsonWebKeySetDto, UnexpectedError>({
        path: `/.well-known/jwks.json`,
        method: 'GET',
        ...params,
      }),
  }
  v1 = {
    /**
     * No description
     *
     * @tags sts
     * @name CreateProjectScopedToken
     * @request POST:/v1/sts/create-project-scoped-token
     * @secure
     */
    createProjectScopedToken: (data: CreateProjectScopedTokenInput, params: RequestParams = {}) =>
      this.request<
        CreateProjectScopedTokenOutput,
        InvalidParameterError | PrincipalDoesNotBelongToProjectError | UnexpectedError
      >({
        path: `/v1/sts/create-project-scoped-token`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags sts
     * @name Whoami
     * @request GET:/v1/sts/whoami
     * @secure
     */
    whoami: (params: RequestParams = {}) =>
      this.request<WhoamiDto, ActionForbiddenError | NotFoundError | UnexpectedError>({
        path: `/v1/sts/whoami`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name CreateProject
     * @request POST:/v1/projects
     * @secure
     */
    createProject: (data: CreateProjectInput, params: RequestParams = {}) =>
      this.request<ProjectDto, InvalidParameterError | UnexpectedError>({
        path: `/v1/projects`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name ListProject
     * @request GET:/v1/projects
     * @secure
     */
    listProject: (params: RequestParams = {}) =>
      this.request<ProjectList, UnexpectedError>({
        path: `/v1/projects`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name ListPrincipalsOfProject
     * @request GET:/v1/projects/principals
     * @secure
     */
    listPrincipalsOfProject: (params: RequestParams = {}) =>
      this.request<UserList, InvalidParameterError | ActionForbiddenError | UnexpectedError>({
        path: `/v1/projects/principals`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name AddPrincipalToProject
     * @request POST:/v1/projects/principals
     * @secure
     */
    addPrincipalToProject: (data: AddUserToProjectInput, params: RequestParams = {}) =>
      this.request<void, InvalidParameterError | ActionForbiddenError | UnexpectedError>({
        path: `/v1/projects/principals`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name DeletePrincipalFromProject
     * @request DELETE:/v1/projects/principals/{principalId}
     * @secure
     */
    deletePrincipalFromProject: (
      principalId: string,
      query: {
        /** type of principal */
        principalType: 'user' | 'token'
      },
      params: RequestParams = {},
    ) =>
      this.request<void, InvalidParameterError | ActionForbiddenError | UnexpectedError>({
        path: `/v1/projects/principals/${principalId}`,
        method: 'DELETE',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name GetPolicies
     * @request GET:/v1/policies/principals/{principalId}
     * @secure
     */
    getPolicies: (
      principalId: string,
      query: {
        principalType: 'user' | 'token'
      },
      params: RequestParams = {},
    ) =>
      this.request<PolicyDto, InvalidParameterError | NotFoundError | UnexpectedError>({
        path: `/v1/policies/principals/${principalId}`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name UpdatePolicies
     * @request PUT:/v1/policies/principals/{principalId}
     * @secure
     */
    updatePolicies: (
      principalId: string,
      query: {
        principalType: 'user' | 'token'
      },
      data: PolicyDto,
      params: RequestParams = {},
    ) =>
      this.request<PolicyDto, InvalidParameterError | UnexpectedError>({
        path: `/v1/policies/principals/${principalId}`,
        method: 'PUT',
        query: query,
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tokens
     * @name CreateToken
     * @request POST:/v1/tokens
     * @secure
     */
    createToken: (data: CreateTokenInput, params: RequestParams = {}) =>
      this.request<TokenDto, InvalidParameterError | UnexpectedError>({
        path: `/v1/tokens`,
        method: 'POST',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tokens
     * @name ListToken
     * @request GET:/v1/tokens
     * @secure
     */
    listToken: (params: RequestParams = {}) =>
      this.request<TokenList, InvalidParameterError | UnexpectedError>({
        path: `/v1/tokens`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tokens
     * @name GetToken
     * @request GET:/v1/tokens/{tokenId}
     * @secure
     */
    getToken: (tokenId: string, params: RequestParams = {}) =>
      this.request<TokenDto, ActionForbiddenError | NotFoundError | UnexpectedError>({
        path: `/v1/tokens/${tokenId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tokens
     * @name UpdateToken
     * @request PATCH:/v1/tokens/{tokenId}
     * @secure
     */
    updateToken: (tokenId: string, data: UpdateTokenInput, params: RequestParams = {}) =>
      this.request<TokenDto, ActionForbiddenError | NotFoundError | UnexpectedError>({
        path: `/v1/tokens/${tokenId}`,
        method: 'PATCH',
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tokens
     * @name DeleteToken
     * @request DELETE:/v1/tokens/{tokenId}
     * @secure
     */
    deleteToken: (tokenId: string, params: RequestParams = {}) =>
      this.request<void, ActionForbiddenError | NotFoundError | UnexpectedError>({
        path: `/v1/tokens/${tokenId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Use open source libraries to perform OAuth 2.0 and OpenID Connect available for any programming language. You can find a list of libraries here https://oauth.net/code/ The Ory SDK is not yet able to this endpoint properly.
     *
     * @tags consumerAuth
     * @name ConsumerAuthTokenEndpoint
     * @summary The Consumer OAuth 2.0 Token Endpoint
     * @request POST:/v1/consumer/oauth2/token
     */
    consumerAuthTokenEndpoint: (data: ConsumerAuthTokenEndpointInput, params: RequestParams = {}) =>
      this.request<ConsumerAuthTokenEndpointOutput, UnauthorizedError | UnexpectedError>({
        path: `/v1/consumer/oauth2/token`,
        method: 'POST',
        body: data,
        ...params,
      }),
  }
}
