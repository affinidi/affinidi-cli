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
* The URL interface represents an object providing static methods used for creating object URLs.
`URL` class is a global reference for `require('url').URL`
https://nodejs.org/api/url.html#the-whatwg-url-api
*/
export type URL = string

/**
 * Description of schema
 */
export interface SchemaDescription {
  type: string
  /**
   * The URL interface represents an object providing static methods used for creating object URLs.
   * `URL` class is a global reference for `require('url').URL`
   * https://nodejs.org/api/url.html#the-whatwg-url-api
   */
  jsonLdContextUrl: URL
  /**
   * The URL interface represents an object providing static methods used for creating object URLs.
   * `URL` class is a global reference for `require('url').URL`
   * https://nodejs.org/api/url.html#the-whatwg-url-api
   */
  jsonSchemaUrl: URL
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
 * @title console-vc-issuance
 * @version 1.49.1
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
