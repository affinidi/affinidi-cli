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
 * @title @affinidi/schema-manager
 * @version 1.14.2
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
