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
    location?: 'body' | 'path' | 'query'
  }[]
}

export interface CreateProjectScopedTokenInput {
  projectId: string
}

export interface CreateProjectScopedTokenOutput {
  /** @format jwt */
  accessToken: string
  expiresIn: number
  scope: string
}

export interface ProjectDto {
  id: string
  name: string
  projectType?: string
  additionalData?: string
}

export interface CreateProjectInput {
  name: string
}

export interface UpdateProjectInput {
  name: string
}

export type ProjectList = ProjectDto[]

export interface UserDto {
  id: string
  name: string
  projectId?: string
}

export interface CreateUserInput {
  name: string
}

export interface UpdateUserInput {
  name: string
}

export interface UserList {
  users: UserDto[]
}

export interface PolicyDto {
  id: string
  Version?: string
  Statement?: any[]
  userId?: string
}

export interface CreatePolicyInput {
  name: string
}

export interface UpdatePolicyInput {
  name: string
}

export interface PolicyList {
  policies: PolicyDto[]
}

export interface JsonWebKeyDto {
  kid: string
  kty: 'RSA'
  n: string
  e: string
  alg: 'PS256'
  use: 'sig'
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
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '/' })
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
 * @title Affinidi IAM
 * @version 1.0.0
 * @baseUrl /
 * @contact
 *
 * Affinidi IAM
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  publicKeys = {
    /**
     * No description
     *
     * @tags iam
     * @name GetPublicKeys
     * @request GET:/public-keys
     */
    getPublicKeys: (params: RequestParams = {}) =>
      this.request<JsonWebKeyDto, ServiceErrorResponse>({
        path: `/public-keys`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  updateTrustRelationship = {
    /**
     * No description
     *
     * @tags operational
     * @name UpdateTrustRelationship
     * @request POST:/update-trust-relationship
     * @secure
     */
    updateTrustRelationship: (params: RequestParams = {}) =>
      this.request<void, ServiceErrorResponse>({
        path: `/update-trust-relationship`,
        method: 'POST',
        secure: true,
        ...params,
      }),
  }
  createProjectScopedToken = {
    /**
     * No description
     *
     * @tags sts
     * @name CreateProjectScopedToken
     * @request POST:/create-project-scoped-token
     * @secure
     */
    createProjectScopedToken: (data: CreateProjectScopedTokenInput, params: RequestParams = {}) =>
      this.request<CreateProjectScopedTokenOutput, ServiceErrorResponse>({
        path: `/create-project-scoped-token`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
  projects = {
    /**
     * No description
     *
     * @tags projects
     * @name GetProject
     * @request GET:/projects/{projectId}
     */
    getProject: (projectId: string, params: RequestParams = {}) =>
      this.request<ProjectDto, ServiceErrorResponse>({
        path: `/projects/${projectId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name UpdateProject
     * @request PUT:/projects/{projectId}
     */
    updateProject: (projectId: string, data: UpdateProjectInput, params: RequestParams = {}) =>
      this.request<ProjectDto, ServiceErrorResponse>({
        path: `/projects/${projectId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name DeleteProject
     * @request DELETE:/projects/{projectId}
     */
    deleteProject: (projectId: string, params: RequestParams = {}) =>
      this.request<ProjectDto, ServiceErrorResponse>({
        path: `/projects/${projectId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name CreateProject
     * @request POST:/projects
     * @secure
     */
    createProject: (data: CreateProjectInput, params: RequestParams = {}) =>
      this.request<ProjectDto, ServiceErrorResponse>({
        path: `/projects`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name ListProject
     * @request GET:/projects
     * @secure
     */
    listProject: (params: RequestParams = {}) =>
      this.request<ProjectList, any>({
        path: `/projects`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetUser
     * @request GET:/projects/{projectId}/users/{userId}
     */
    getUser: (userId: string, projectId: string, params: RequestParams = {}) =>
      this.request<UserDto, ServiceErrorResponse>({
        path: `/projects/${projectId}/users/${userId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name UpdateUser
     * @request PUT:/projects/{projectId}/users/{userId}
     */
    updateUser: (
      projectId: string,
      userId: string,
      data: UpdateUserInput,
      params: RequestParams = {},
    ) =>
      this.request<UserDto, ServiceErrorResponse>({
        path: `/projects/${projectId}/users/${userId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name DeleteUser
     * @request DELETE:/projects/{projectId}/users/{userId}
     */
    deleteUser: (userId: string, projectId: string, params: RequestParams = {}) =>
      this.request<UserDto, ServiceErrorResponse>({
        path: `/projects/${projectId}/users/${userId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name CreateUser
     * @request POST:/projects/{projectId}/users
     */
    createUser: (projectId: string, data: CreateUserInput, params: RequestParams = {}) =>
      this.request<UserDto, ServiceErrorResponse>({
        path: `/projects/${projectId}/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name ListUser
     * @request GET:/projects/{projectId}/users
     */
    listUser: (projectId: string, params: RequestParams = {}) =>
      this.request<UserList, any>({
        path: `/projects/${projectId}/users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  policies = {
    /**
     * No description
     *
     * @tags policies
     * @name GetFromObjectsPolicy
     * @request GET:/policies/{policyId}
     */
    getFromObjectsPolicy: (policyId: string, params: RequestParams = {}) =>
      this.request<PolicyDto, ServiceErrorResponse>({
        path: `/policies/${policyId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  users = {
    /**
     * No description
     *
     * @tags policies
     * @name GetPolicy
     * @request GET:/users/{userId}/policies/{policyId}
     */
    getPolicy: (policyId: string, userId: string, params: RequestParams = {}) =>
      this.request<PolicyDto, ServiceErrorResponse>({
        path: `/users/${userId}/policies/${policyId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name UpdatePolicy
     * @request PUT:/users/{userId}/policies/{policyId}
     */
    updatePolicy: (
      userId: string,
      policyId: string,
      data: UpdatePolicyInput,
      params: RequestParams = {},
    ) =>
      this.request<PolicyDto, ServiceErrorResponse>({
        path: `/users/${userId}/policies/${policyId}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name DeletePolicy
     * @request DELETE:/users/{userId}/policies/{policyId}
     */
    deletePolicy: (policyId: string, userId: string, params: RequestParams = {}) =>
      this.request<PolicyDto, ServiceErrorResponse>({
        path: `/users/${userId}/policies/${policyId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name CreatePolicy
     * @request POST:/users/{userId}/policies
     */
    createPolicy: (userId: string, data: CreatePolicyInput, params: RequestParams = {}) =>
      this.request<PolicyDto, ServiceErrorResponse>({
        path: `/users/${userId}/policies`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags policies
     * @name ListPolicy
     * @request GET:/users/{userId}/policies
     */
    listPolicy: (userId: string, params: RequestParams = {}) =>
      this.request<PolicyList, any>({
        path: `/users/${userId}/policies`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
}
