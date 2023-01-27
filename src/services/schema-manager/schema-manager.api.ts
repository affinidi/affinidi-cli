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

/**
* `DidAuthRequestToken` is the token that user should use to generate a `DidAuthResponseToken`.  
`DidAuthResponseToken` can then used to authenticate the subsequent calls to Schema Manager endpoints.
*/
export type DidAuthRequestToken = string

export interface DidAuthRequestTokenInput {
  /** DID that user is trying to authenticate with */
  audienceDid: string
  /**
   * When to expire the request token.
   * @format int32
   */
  expiresAt?: number
}

/**
* Schema entity.  
Do not confuse with "JSON schema".  

Schema is an object that contains:  
- Some metadata: creation date, authorDid, parentId, etc.  
- Links to JSON Schema and JSON-LD context files.
*/
export interface SchemaDto {
  /**
   * Internal identifier of the schema.
   * Used for URLs or `parentId` field.
   */
  id: string
  /**
   * ID of the parent of the schema.
   * This identifies whether the schema is forked or not.
   * Only used for UX purposes.
   */
  parentId: string | null
  /** DID of the schema's author. */
  authorDid: string
  /**
   * Description of the schema.
   * Only used for UX purposes.
   */
  description: string | null
  /**
   * Creation date of the schema.
   * @format date-time
   */
  createdAt: string
  /**
   * Namespace of the schema.
   * `null` means that schema is public.
   * Any other value means that schema is unlisted under a namespace.
   * Currently, if namespace exists, it always equals to the `authorDid` field.
   */
  namespace: string | null
  /**
   * VC type.
   * Reference: https://www.w3.org/TR/vc-data-model/#types
   */
  type: string
  /**
   * Version of the schema.
   * Ideally, each new version should represent a major (breaking) change in the schema.
   * For example: adding new required properties or renaming them.
   * We do not enforce that, so this is only used for UX purposes.
   * @format int32
   */
  version: number
  /**
   * Revision of the schema.
   * Ideally, each new revision should represent a minor (backwards compatible) change in the schema.
   * For example: moving properties from one place to another, adding new optional properties.
   * @format int32
   */
  revision: number
  /**
   * Link to the JSON schema file that is used for VC validation.
   * Reference: https://www.w3.org/TR/vc-data-model/#data-schemas
   */
  jsonSchemaUrl: string
  /**
   * Link to the JSON-LD context file.
   * Reference: https://www.w3.org/TR/vc-data-model/#contexts
   */
  jsonLdContextUrl: string
}

export interface CreateSchemaInputDto {
  /**
   * DID of the schema's author.
   * Required if console authentication is used.
   */
  authorDid?: string
  /**
   * Description of the schema.
   * Only used for UX purposes.
   */
  description?: string | null
  /**
   * ID of the parent of the schema.
   * This identifies whether the schema is forked or not.
   * Only used for UX purposes.
   */
  parentId?: string | null
  /**
   * Scope of the schema can be either public or unlisted.
   * Unlisted schemas do not appear in the search, unless you are their owner.
   * Unlisted schemas can still be accessed by their ID, so they are not private.
   * Unlisted schemas are prefixed with author's DID.
   */
  scope: 'public' | 'unlisted'
  /**
   * VC type.
   * Reference: https://www.w3.org/TR/vc-data-model/#types
   * @pattern ^[a-zA-Z0-9]{2,}$
   */
  type: string
  /**
   * Version of the schema.
   * Ideally, each new version should represent a major (breaking) change in the schema.
   * For example: adding new required properties or renaming them.
   * We do not enforce that, so this is only used for UX purposes.
   * @format int32
   * @min 1
   */
  version: number
  /**
   * Revision of the schema.
   * Ideally, each new revision should represent a minor (backwards compatible) change in the schema.
   * For example: moving properties from one place to another, adding new optional properties.
   * @format int32
   * @min 0
   * @max 999
   */
  revision: number
  /**
   * JSON representation of the JSON schema file that is used for VC validation.
   * Reference: https://www.w3.org/TR/vc-data-model/#data-schemas
   */
  jsonSchema: Record<string, any>
  /**
   * JSON representation of the JSON-LD context file.
   * Reference: https://www.w3.org/TR/vc-data-model/#contexts
   */
  jsonLdContext: Record<string, any>
}

/**
 * Paginated schema search results.
 */
export interface SearchSchemasOutputDto {
  /**
   * List of found schemas by the provided criteria.
   * Sorted from the newest (highest version & revision) to oldest.
   */
  schemas: SchemaDto[]
  /**
   * Total amount of schemas that are found by the provided criteria.
   * @format int32
   */
  count: number
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
 * @title @affinidi/schema-manager
 * @version 1.19.0
 * @license ISC
 * @baseUrl /api/v1
 * @contact Vitaly Rudenko  <vitaly.r@affinidi.com>
 *
 * Schema Manager API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  didAuth = {
    /**
     * @description You can see <a href='https://swimlanes.io/u/GolxCmVL0' target='_blank' rel='noreferrer noopener'>this flow</a> for reference. In general, the client sends request to the server that he wants to get authenticated. The server creates a request and client creates response for that request, and that response using as auth.
     *
     * @tags SchemaManagerDidAuthentication
     * @name SchemaManagerCreateDidAuthRequest
     * @request POST:/did-auth/create-did-auth-request
     */
    schemaManagerCreateDidAuthRequest: (
      data: DidAuthRequestTokenInput,
      params: RequestParams = {},
    ) =>
      this.request<DidAuthRequestToken, any>({
        path: `/did-auth/create-did-auth-request`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
  schemas = {
    /**
     * @description Create a VC schema. VC schema consists of two files: - JSON-LD context for describing the fields, - JSON schema for validating the fields.
     *
     * @tags Schema
     * @name CreateSchema
     * @request POST:/schemas
     * @secure
     */
    createSchema: (data: CreateSchemaInputDto, params: RequestParams = {}) =>
      this.request<SchemaDto, any>({
        path: `/schemas`,
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
     * @tags Schema
     * @name SearchSchemas
     * @request GET:/schemas
     * @secure
     */
    searchSchemas: (
      query?: {
        /** Search by scope: only public, only unlisted (that you own) or both. */
        scope?: 'public' | 'unlisted' | 'default'
        /** Schema author's DID */
        authorDid?: string
        /**
         * Partial search by type. For example: `BusinessCard*`, `*CardVC` or `*Card*`
         * @pattern ^(?=.*\*)\*?[a-zA-Z0-9]{2,}\*?$
         */
        query?: string
        /** Search by exact type */
        type?: string
        /**
         * Search by exact version (can be useful to find the latest revision)
         * @format int32
         * @min 1
         */
        version?: number
        /**
         * Pagination parameter for skipping search results
         * @format int32
         * @min 0
         */
        skip?: number
        /**
         * Pagination parameter for limiting search results
         * @format int32
         * @min 1
         * @max 1000
         */
        limit?: number
        did?: string
      },
      params: RequestParams = {},
    ) =>
      this.request<SearchSchemasOutputDto, any>({
        path: `/schemas`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get schema by its internal ID.
     *
     * @tags Schema
     * @name GetSchema
     * @request GET:/schemas/{schemaId}
     */
    getSchema: (schemaId: string, params: RequestParams = {}) =>
      this.request<SchemaDto, any>({
        path: `/schemas/${schemaId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
}
