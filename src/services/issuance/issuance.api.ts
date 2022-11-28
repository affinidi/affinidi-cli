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

export interface BatchIssuanceOutput {
  /** Id of the batch Issuance */
  id: string
}

export interface OperationErrorType {
  code: string
  message: string
}

export interface BatchIssuanceCreateInput {
  /**
   * Id of the Data Source
   * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$
   */
  dataSourceId: string
  /**
   * Any Schema Manager URL is supported, for example:<br>
   * https://ui.schema.affinidi.com/schemas/MySchemaV1-0<br>
   * https://schema.affinidi.com/MySchemaV1-0.json<br>
   * https://schema.affinidi.com/MySchemaV1-0.jsonld<br>
   */
  schemaURL: string
  /** Id of the project */
  projectId: string
  /** information of the person who issue the Vcs */
  issuer: {
    accessToken: string
    did: string
  }
}

export interface BatchIssuanceListingItem {
  /** VC type. */
  schemaType: string
  /**
   * Any Schema Manager URL is supported, for example:<br>
   * https://ui.schema.affinidi.com/schemas/MySchemaV1-0<br>
   * https://schema.affinidi.com/MySchemaV1-0.json<br>
   * https://schema.affinidi.com/MySchemaV1-0.jsonld<br>
   */
  schemaURL: string
  /** Creation date of the bulk Issuance. */
  createdAt: string
  /** Date of the bulk issuance after changing the status from Pending to Issued. */
  updatedAt: string
  /**
   * Number of the VCs that are issued.
   * @format double
   */
  issued: number
  /** Issuing progress of the Bulk Issuance. */
  status: 'PENDING' | 'ISSUED'
}

export interface BatchIssuanceRowItem {
  /**
   * Id of a VC
   * @format double
   */
  rowId: number
  /** Did of ther person who own the VC */
  holderDid: string
  /** Issuing progress of the single VC Issuance. */
  status: 'PENDING' | 'SUCCESS' | 'ERROR'
  /** Error information if the status is Error */
  error?: string
  /** Creation date of the bulk Issuance. */
  createdAt: string
  /** Update date of the VC when its status is changed */
  updatedAt: string
}

export interface BatchIssuanceDetailOutput {
  /** Id of the batch Issuance */
  id: string
  batchIssuance: BatchIssuanceListingItem
  batchIssuanceRows: BatchIssuanceRowItem[]
}

export interface BatchIssuanceListingOutput {
  results: BatchIssuanceListingItem[]
}

export type AnyObject = Record<string, any>

/**
 * Result of the upload operation which contains the information to reference the data source in later operations.
 */
export interface UploadFileResponse {
  /** Id of the Data Source that can be used as a reference to start Batch Issuance operations. */
  id: string
}

export enum OfferStatus {
  CREATED = 'CREATED',
  CLAIMED = 'CLAIMED',
}

/**
 * Description of schema
 */
export interface SchemaDescription {
  type: string
  jsonLdContextUrl: string
  jsonSchemaUrl: string
}

export interface OfferDto {
  verification: {
    target: {
      email: string
    }
    method: string
  }
  /** Description of schema */
  schema: SchemaDescription
  issuerDid: string
  /** @format date-time */
  expiresAt: string
  statusLog: {
    /** @format date-time */
    at: string
    status: OfferStatus
  }[]
  status: 'CREATED' | 'CLAIMED'
  id: string
}

export interface CreateIssuanceOfferInput {
  verification: {
    target: {
      email: string
    }
  }
  credentialSubject: AnyObject
}

export enum VerificationMethod {
  Email = 'email',
}

export interface CreateIssuanceOutput {
  id: string
}

export interface CreateIssuanceInput {
  template: {
    walletUrl?: string
    verification: {
      method: VerificationMethod
    }
    schema: {
      jsonLdContextUrl: string
      jsonSchemaUrl: string
      type: string
    }
    issuerDid: string
  }
  projectId: string
}

export interface IssuanceDto {
  /** @format date-time */
  createdAt: string
  template: {
    verification: {
      method: VerificationMethod
    }
    /** Description of schema */
    schema: SchemaDescription
    issuerDid: string
  }
  projectId: string
  id: string
}

export interface AffinidiClaimOutput {
  vcs: AnyObject[]
}

export interface AffinidiClaimInput {
  credentialOfferResponseToken: string
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
 * @title console-vc-issuance
 * @version 1.54.2
 * @license ISC
 * @baseUrl /api/v1
 * @contact Yiğitcan UÇUM yigitcan.u@affinidi.com
 *
 * Console VC issuance operations
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  batchIssuance = {
    /**
     * @description Issue VCs in a batch
     *
     * @tags batch-issuance
     * @name Create
     * @request POST:/batch-issuance
     * @secure
     */
    create: (data: BatchIssuanceCreateInput, params: RequestParams = {}) =>
      this.request<BatchIssuanceOutput, OperationErrorType>({
        path: `/batch-issuance`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all Batch Issuances started in the Project scope
     *
     * @tags batch-issuance
     * @name GetByProjectId
     * @request GET:/batch-issuance
     * @secure
     */
    getByProjectId: (
      query: {
        projectId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<BatchIssuanceListingOutput, any>({
        path: `/batch-issuance`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get details of a specific batch issuance records and its progress
     *
     * @tags batch-issuance
     * @name Get
     * @request GET:/batch-issuance/{batchIssuanceId}
     * @secure
     */
    get: (batchIssuanceId: string, params: RequestParams = {}) =>
      this.request<BatchIssuanceDetailOutput, OperationErrorType>({
        path: `/batch-issuance/${batchIssuanceId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get the VC issued as part of the Batch Issuance progress, using the corresponding rowId of the Issuance operation
     *
     * @tags batch-issuance
     * @name GetRow
     * @request GET:/batch-issuance/{batchIssuanceId}/row/{rowId}
     * @secure
     */
    getRow: (batchIssuanceId: string, rowId: string, params: RequestParams = {}) =>
      this.request<AnyObject, OperationErrorType>({
        path: `/batch-issuance/${batchIssuanceId}/row/${rowId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags data-source
     * @name UploadFile
     * @request POST:/batch-issuance/data-source
     * @secure
     */
    uploadFile: (
      data: {
        projectId: string
        /** @format binary */
        file: File
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadFileResponse, OperationErrorType>({
        path: `/batch-issuance/data-source`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  issuances = {
    /**
     * No description
     *
     * @tags issuances
     * @name CreateOffer
     * @request POST:/issuances/{issuanceId}/offers
     * @secure
     */
    createOffer: (issuanceId: string, data: CreateIssuanceOfferInput, params: RequestParams = {}) =>
      this.request<OfferDto, any>({
        path: `/issuances/${issuanceId}/offers`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all Offers in the Issuance
     *
     * @tags issuances
     * @name SearchOffers
     * @request GET:/issuances/{issuanceId}/offers
     * @secure
     */
    searchOffers: (issuanceId: string, params: RequestParams = {}) =>
      this.request<
        {
          offers: OfferDto[]
        },
        any
      >({
        path: `/issuances/${issuanceId}/offers`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags issuances
     * @name CreateFromCsvFile
     * @request POST:/issuances/create-from-csv
     * @deprecated
     * @secure
     */
    createFromCsvFile: (
      data: {
        issuance: string
        /** @format binary */
        offers: File
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          issuance: {
            id: string
          }
        },
        any
      >({
        path: `/issuances/create-from-csv`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags issuances
     * @name GetCsvTemplate
     * @request GET:/issuances/csv-template
     * @secure
     */
    getCsvTemplate: (
      query: {
        jsonSchemaUrl: string
        verificationMethod: VerificationMethod
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/issuances/csv-template`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Create issuance
     *
     * @tags issuances
     * @name CreateIssuance
     * @request POST:/issuances
     * @secure
     */
    createIssuance: (data: CreateIssuanceInput, params: RequestParams = {}) =>
      this.request<CreateIssuanceOutput, any>({
        path: `/issuances`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all Issuances in the Project
     *
     * @tags issuances
     * @name SearchIssuances
     * @request GET:/issuances
     * @secure
     */
    searchIssuances: (
      query: {
        projectId: string
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          issuances: IssuanceDto[]
        },
        any
      >({
        path: `/issuances`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get details of a specific issuance
     *
     * @tags issuances
     * @name GetIssuance
     * @request GET:/issuances/{issuanceId}
     * @secure
     */
    getIssuance: (issuanceId: string, params: RequestParams = {}) =>
      this.request<IssuanceDto, any>({
        path: `/issuances/${issuanceId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  }
  offers = {
    /**
     * No description
     *
     * @tags offers
     * @name AffinidiClaim
     * @request POST:/offers/{offerId}/affinidi-claim
     */
    affinidiClaim: (offerId: string, data: AffinidiClaimInput, params: RequestParams = {}) =>
      this.request<AffinidiClaimOutput, any>({
        path: `/offers/${offerId}/affinidi-claim`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
}
