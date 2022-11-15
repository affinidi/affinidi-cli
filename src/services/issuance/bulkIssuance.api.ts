import { AxiosResponse } from 'axios'
import FormData from 'form-data'

import { Api, ContentType, FullRequestParams, RequestParams } from './issuance.api'

type SecurityDataType = unknown
export class BulkApi extends Api<SecurityDataType> {
  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams = this.mergeRequestParams(params)
    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      data: body,
      url: path,
    })
  }

  bulkIssuances = {
    /**
     * No description
     *
     * @tags issuances
     * @name CreateFromCsvFile
     * @request POST:/issuances/create-from-csv
     * @secure
     */
    createFromCsvFile: (data: FormData, params: RequestParams = {}) =>
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
  }
}
