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

export interface AuthenticateCloudWalletOutput {
  apiKey: {
    apiKeyHash: string
  }
  wallet: {
    accessToken: string
    didUrl: string
    did: string
  }
}

export interface ProjectDto {
  projectId: string
  name: string
  /** @format date-time */
  createdAt: string
}

export interface ProjectSummary {
  wallet: {
    didUrl: string
    did: string
  }
  apiKey: {
    apiKeyHash: string
    apiKeyName: string
  }
  project: ProjectDto
}

export interface CreateProjectInput {
  name: string
}

export interface ProjectList {
  projects: ProjectDto[]
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
 * @title affinidi-iam
 * @version 1.37.0
 * @license ISC
 * @baseUrl /api/v1
 * @contact Yigitcan UCUM yigitcan.u@affinidi.com
 *
 * Affinidi IAM
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  cloudWallet = {
    /**
     * No description
     *
     * @tags cloud-wallet
     * @name GetCloudWallet
     * @request GET:/cloud-wallet/{did}
     * @secure
     */
    getCloudWallet: (did: string, params: RequestParams = {}) =>
      this.request<
        {
          didUrl: string
          did: string
        },
        any
      >({
        path: `/cloud-wallet/${did}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags cloud-wallet
     * @name Authenticate
     * @request POST:/cloud-wallet/{did}/authenticate
     * @secure
     */
    authenticate: (did: string, params: RequestParams = {}) =>
      this.request<AuthenticateCloudWalletOutput, any>({
        path: `/cloud-wallet/${did}/authenticate`,
        method: 'POST',
        secure: true,
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
     * @secure
     */
    getProject: (projectId: string, params: RequestParams = {}) =>
      this.request<ProjectDto, any>({
        path: `/projects/${projectId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get the project with associated api key and wallet information
     *
     * @tags projects
     * @name GetProjectSummary
     * @request GET:/projects/{projectId}/summary
     * @secure
     */
    getProjectSummary: (projectId: string, params: RequestParams = {}) =>
      this.request<ProjectSummary, any>({
        path: `/projects/${projectId}/summary`,
        method: 'GET',
        secure: true,
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
      this.request<ProjectDto, any>({
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
     * @name ListProjects
     * @request GET:/projects
     * @secure
     */
    listProjects: (params: RequestParams = {}) =>
      this.request<ProjectList, any>({
        path: `/projects`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  }
}
