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
  configurationId?: string
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
  /** IDP client id to Associate the Session with */
  clientId: string
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
  configurationId?: string
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
  /** Requested Client Authentication method for the Token Endpoint. The options are: `client_secret_post`: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body. `client_secret_basic`: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP Authorization header. `none`: For public clients (native/mobile apps) which can not have secret. */
  tokenEndpointAuthMethod: TokenEndpointAuthMethod
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
  /** Unique identifier of the user */
  userId: string
  /** Group to user mapping creation date */
  addedAt: string
}

/** input used to add a user to a group */
export interface AddUserToGroupInput {
  /** Unique identifier of the user */
  userId: string
}

/** input used to remove a user from a group */
export interface RemoveUserFromGroupInput {
  /** Unique identifier of the user */
  userId: string
}

export interface GroupsList {
  groups?: GroupDto[]
}

export interface GroupUserMappingsList {
  users?: GroupUserMappingDto[]
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

export interface JsonWebKey {
  /** The value of the "keys" parameter is an array of JSON Web Key (JWK) values.  By default, the order of the JWK values within the array does not imply an  order of preference among them, although applications of JWK Sets can choose  to assign a meaning to the order for their purposes, if desired. */
  keys?: {
    /** The "alg" (algorithm) parameter identifies the algorithm intended for use  with the key. The values used should either be registered in the IANA  "JSON Web Signature and Encryption Algorithms" registry established  by [JWA] or be a value that contains a Collision- Resistant Name. */
    alg: string
    crv?: string
    d?: string
    dp?: string
    dq?: string
    e?: string
    k?: string
    /** The "kid" (key ID) parameter is used to match a specific key. This is used,  for instance, to choose among a set of keys within a JWK Set during key  rollover. The structure of the "kid" value is unspecified. When "kid"  values are used within a JWK Set, different keys within the JWK Set SHOULD  use distinct "kid" values. (One example in which different keys might use  the same "kid" value is if they have different "kty" (key type) values but  are considered to be equivalent alternatives by the application using them.)  The "kid" value is a case-sensitive string. */
    kid: string
    /** The "kty" (key type) parameter identifies the cryptographic algorithm family  used with the key, such as "RSA" or "EC". "kty" values should either be  registered in the IANA "JSON Web Key Types" registry established by [JWA]  or be a value that contains a Collision- Resistant Name. The "kty" value  is a case-sensitive string. */
    kty: string
    n?: string
    p?: string
    q?: string
    qi?: string
    /** Use ("public key use") identifies the intended use of the public key. The  "use" parameter is employed to indicate whether a public key is used for  encrypting data or verifying the signature on data. Values are commonly  "sig" (signature) or "enc" (encryption). */
    use: string
    x?: string
    /** The "x5c" (X.509 certificate chain) parameter contains a chain of one  or more PKIX certificates [RFC5280]. The certificate chain is represented  as a JSON array of certificate value strings. Each string in the array is  a base64-encoded (Section 4 of [RFC4648] -- not base64url-encoded) DER  [ITU.X690.1994] PKIX certificate value. The PKIX certificate containing the  key value MUST be the first certificate. */
    x5c: string[]
    y?: string
  }[]
}

export interface OIDCConfig {
  /** OAuth 2.0 Authorization Endpoint URL */
  authorization_endpoint: string
  /** OpenID Connect Back-Channel Logout Session Required. Boolean value specifying whether the OP can pass a sid (session ID)  Claim in the Logout Token to identify the RP session with the OP. If  supported, the sid Claim is also included in ID Tokens issued by the OP */
  backchannel_logout_session_supported?: boolean
  /** OpenID Connect Back-Channel Logout Supported. Boolean value specifying whether the OP supports  back-channel logout, with true indicating support. */
  backchannel_logout_supported?: boolean
  /** OpenID Connect Claims Parameter Parameter Supported Boolean value specifying whether the OP supports use  of the claims parameter, with true indicating support. */
  claims_parameter_supported?: boolean
  /** OpenID Connect Supported Claims   JSON array containing a list of the Claim Names of the  Claims that the OpenID Provider MAY be able to supply  values for. Note that for privacy or other reasons,  this might not be an exhaustive list. */
  claims_supported?: string[]
  /** OAuth 2.0 PKCE Supported Code Challenge Methods JSON array containing a list of Proof Key for Code  Exchange (PKCE) [RFC7636] code challenge methods  supported by this authorization server. */
  code_challenge_methods_supported?: string[]
  /** OpenID Connect Verifiable Credentials Endpoint Contains the URL of the Verifiable Credentials Endpoint. */
  credentials_endpoint_draft_00?: string
  /** OpenID Connect Verifiable Credentials Supported JSON array containing a list of the Verifiable  Credentials supported by this authorization server. */
  credentials_supported_draft_00?: {
    cryptographic_binding_methods_supported?: string[]
    cryptographic_suites_supported?: string[]
    format?: string
    types?: string[]
  }[]
  /** OpenID Connect End-Session Endpoint URL at the OP to which an RP can perform  a redirect to request that the End-User be  logged out at the OP. */
  end_session_endpoint?: string
  /** OpenID Connect Front-Channel Logout Session Required Boolean value specifying whether the OP can pass iss  (issuer) and sid (session ID) query parameters to identify  the RP session with the OP when the frontchannel_logout_uri  is used. If supported, the sid Claim is also included in ID  Tokens issued by the OP. */
  frontchannel_logout_session_supported?: boolean
  /** OpenID Connect Front-Channel Logout Supported Boolean value specifying whether the OP supports HTTP-based logout, with true indicating support. */
  frontchannel_logout_supported?: boolean
  /** OAuth 2.0 Supported Grant Types JSON array containing a list of the OAuth 2.0 Grant Type values that this OP supports. */
  grant_types_supported?: string[]
  /**
   * OpenID Connect Default ID Token Signing Algorithms
   * Algorithm used to sign OpenID Connect ID Tokens.
   */
  id_token_signed_response_alg: string[]
  /**
   * OpenID Connect Supported ID Token Signing Algorithms
   * JSON array containing a list of the JWS signing algorithms  (alg values) supported by the OP for the ID Token to encode the Claims in a JWT.
   */
  id_token_signing_alg_values_supported: string[]
  /**
   * OpenID Connect Issuer URL
   * An URL using the https scheme with no query or fragment component  that the OP asserts as its IssuerURL Identifier. If IssuerURL discovery  is supported , this value MUST be identical to the issuer value returned by WebFinger.  This also MUST be identical to the iss Claim value in ID Tokens issued from this IssuerURL.
   */
  issuer: string
  /**
   * OpenID Connect Well-Known JSON Web Keys URL
   * URL of the OP's JSON Web Key Set [JWK] document. This contains the signing key(s) the RP  uses to validate signatures from the OP. The JWK Set MAY also contain the Server's  encryption key(s), which are used by RPs to encrypt requests to the Server. When both  signing and encryption keys are made available, a use (Key Use) parameter value is REQUIRED  for all keys in the referenced JWK Set to indicate each key's intended usage. Although some  algorithms allow the same key to be used for both signatures and encryption, doing so is  NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509  representations of keys provided. When used, the bare key values MUST still be present and  MUST match those in the certificate.
   */
  jwks_uri: string
  /** OpenID Connect Dynamic Client Registration Endpoint URL */
  registration_endpoint?: string
  /**
   * OpenID Connect Supported Request Object Signing Algorithms
   * JSON array containing a list of the JWS signing algorithms (alg values) supported by  the OP for Request Objects, which are described in Section 6.1 of  OpenID Connect Core 1.0 [OpenID.Core]. These algorithms are used both when the  Request Object is passed by value (using the request parameter) and when it is  passed by reference (using the request_uri parameter).
   */
  request_object_signing_alg_values_supported?: string[]
  /**
   * OpenID Connect Request Parameter Supported
   * Boolean value specifying whether the OP supports use of the request parameter, with true indicating support.
   */
  request_parameter_supported?: boolean
  /**
   * OpenID Connect Request URI Parameter Supported
   * Boolean value specifying whether the OP supports use of the request_uri parameter, with true indicating support.
   */
  request_uri_parameter_supported?: boolean
  /**
   * OpenID Connect Requires Request URI Registration
   * Boolean value specifying whether the OP requires any request_uri values used to be  pre-registered using the request_uris registration parameter.
   */
  require_request_uri_registration?: boolean
  /**
   * OAuth 2.0 Supported Response Modes
   * JSON array containing a list of the OAuth 2.0 response_mode values that this OP supports.
   */
  response_modes_supported?: string[]
  /**
   * OAuth 2.0 Supported Response Types
   * JSON array containing a list of the OAuth 2.0 response_type values that this OP supports.  Dynamic OpenID Providers MUST support the code, id_token, and the token id_token Response Type values.
   */
  response_types_supported: string[]
  /**
   * OAuth 2.0 Token Revocation URL
   * URL of the authorization server's OAuth 2.0 revocation endpoint.
   */
  revocation_endpoint?: string
  /**
   * OAuth 2.0 Supported Scope Values
   * JSON array containing a list of the OAuth 2.0 [RFC6749] scope values that this server supports.  The server MUST support the openid scope value. Servers MAY choose not to advertise  some supported scope values even when this parameter is used
   */
  scopes_supported?: string[]
  /**
   * OpenID Connect Supported Subject Types
   * JSON array containing a list of the Subject Identifier types that this OP supports.  Valid types include pairwise and public.
   */
  subject_types_supported: string[]
  /** OAuth 2.0 Token Endpoint URL */
  token_endpoint: string
  /**
   * OAuth 2.0 Supported Client Authentication Methods
   * JSON array containing a list of Client Authentication methods supported by this Token Endpoint.  The options are client_secret_post, client_secret_basic, client_secret_jwt,  and private_key_jwt, as described in Section 9 of OpenID Connect Core 1.0
   */
  token_endpoint_auth_methods_supported?: string[]
  /**
   * OpenID Connect Userinfo URL
   * URL of the OP's UserInfo Endpoint.
   */
  userinfo_endpoint?: string
  /**
   * OpenID Connect User Userinfo Signing Algorithm
   * Algorithm used to sign OpenID Connect Userinfo Responses.
   */
  userinfo_signed_response_alg: string[]
  /**
   * OpenID Connect Supported Userinfo Signing Algorithm
   * JSON array containing a list of the JWS [JWS] signing algorithms (alg values) [JWA]  supported by the UserInfo Endpoint to encode the Claims in a JWT [JWT].
   */
  userinfo_signing_alg_values_supported?: string[]
}

export interface OAuth2Token {
  /** The access token issued by the authorization server. */
  access_token?: string
  /** The lifetime in seconds of the access token.  For example, the value "3600" denotes that the access  token will expire in one hour from the time the response was generated. */
  expires_in?: number
  /** To retrieve a refresh token request the id_token scope. */
  id_token?: number
  /** The refresh token, which can be used to obtain new access tokens.  To retrieve it add the scope "offline" to your access token request. */
  refresh_token?: string
  /** The scope of the access token */
  scope?: string
  /** The type of the token issued */
  token_type?: string
}

export interface GetUserInfo {
  /** End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.  The year MAY be 0000, indicating that it is omitted. To represent only the year,  YYYY format is allowed. Note that depending on the underlying platform's date related  function, providing just year can result in varying month and day, so the implementers  need to take this factor into account to correctly process the dates. */
  birthdate?: string
  /** End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322]  addr-spec syntax. The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7. */
  email?: string
  /** True if the End-User's e-mail address has been verified; otherwise false. When this  Claim Value is true, this means that the OP took affirmative steps to ensure that  this e-mail address was controlled by the End-User at the time the verification was  performed. The means by which an e-mail address is verified is context-specific, and  dependent upon the trust framework or contractual agreements within which the parties  are operating. */
  email_verified?: boolean
  /** Surname(s) or last name(s) of the End-User. Note that in some cultures, people can have  multiple family names or no family name; all can be present, with the names being  separated by space characters. */
  family_name?: string
  /** End-User's gender. Values defined by this specification are female and male.  Other values MAY be used when neither of the defined values are applicable. */
  gender?: string
  /** Given name(s) or first name(s) of the End-User. Note that in some cultures,  people can have multiple given names; all can be present, with the names being  separated by space characters. */
  given_name?: string
  /** End-User's locale, represented as a BCP47 [RFC5646] language tag. This is  typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase and an  ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash.  For example, en-US or fr-CA. As a compatibility note, some implementations have  used an underscore as the separator rather than a dash, for example, en_US;  Relying Parties MAY choose to accept this locale syntax as well. */
  locale?: string
  /** Middle name(s) of the End-User. Note that in some cultures, people can have  multiple middle names; all can be present, with the names being separated by  space characters. Also note that in some cultures, middle names are not used. */
  middle_name?: string
  /** End-User's full name in displayable form including all name parts, possibly  including titles and suffixes, ordered according to the End-User's locale and preferences. */
  name?: string
  /** Casual name of the End-User that may or may not be the same as the given_name.  For instance, a nickname value of Mike might be returned alongside a given_name value of Michael. */
  nickname?: string
  /** End-User's preferred telephone number. E.164 [E.164] is RECOMMENDED as the format of this Claim,  for example, +1 (425) 555-1212 or +56 (2) 687 2400. If the phone number contains an extension,  it is RECOMMENDED that the extension be represented using the RFC 3966 [RFC3966] extension syntax,  for example, +1 (604) 555-1234;ext=5678. */
  phone_number?: string
  /** True if the End-User's phone number has been verified; otherwise false. When this Claim  Value is true, this means that the OP took affirmative steps to ensure that this phone  number was controlled by the End-User at the time the verification was performed. The means  by which a phone number is verified is context-specific, and dependent upon the trust framework  or contractual agreements within which the parties are operating. When true, the phone_number  Claim MUST be in E.164 format and any extensions MUST be represented in RFC 3966 format. */
  phone_number_verified?: boolean
  /** URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG,  JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD  specifically reference a profile photo of the End-User suitable for displaying when describing the  End-User, rather than an arbitrary photo taken by the End-User. */
  picture?: string
  /** Non-unique shorthand name by which the End-User wishes to be referred to at the RP, such as  janedoe or j.doe. This value MAY be any valid JSON string including special characters  such as @, /, or whitespace. */
  preferred_username?: string
  /** URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User. */
  profile?: string
  /** Subject - Identifier for the End-User at the IssuerURL. */
  sub?: string
  /** Time the End-User's information was last updated. Its value is a JSON number  representing the number of seconds from 1970-01-01T0:0:0Z as measured in UTC until the date/time. */
  updated_at?: number
  /** URL of the End-User's Web page or blog. This Web page SHOULD contain information  published by the End-User or an organization that the End-User is affiliated with. */
  website?: string
  /** String from zoneinfo [zoneinfo] time zone database representing the End-User's  time zone. For example, Europe/Paris or America/Los_Angeles. */
  zoneinfo?: string
}

export interface ErrorOAuth2 {
  /** Error */
  error: string
  /** Error Debug Information. Only available in dev mode. */
  error_debug?: string
  /** Error Description */
  error_description: string
  /** Error Hint. Helps the user identify the error cause. */
  error_hint?: string
  /** HTTP Status Code */
  status_code: string
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
     */
    getClientMetadataByClientId: (clientId: string, params: RequestParams = {}) =>
      this.request<LoginConfigurationClientMetadata, InvalidParameterError | NotFoundError>({
        path: `/v1/login/configurations/metadata/${clientId}`,
        method: 'GET',
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
     * @request DELETE:/v1/groups/{groupName}/users
     * @secure
     */
    removeUserFromGroup: (groupName: string, data: RemoveUserFromGroupInput, params: RequestParams = {}) =>
      this.request<void, InvalidParameterError | ActionForbiddenError | NotFoundError>({
        path: `/v1/groups/${groupName}/users`,
        method: 'DELETE',
        body: data,
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
     * @description This endpoint returns JSON Web Keys required to verifying OpenID Connect ID Tokens and, if enabled, OAuth 2.0 JWT Access Tokens. This endpoint can be used with client libraries like node-jwks-rsa among others.
     *
     * @tags idp
     * @name LoginProjectWellKnownJwksJsonDetail
     * @summary Discover Well-Known JSON Web Keys
     * @request GET:/v1/login/project/{projectId}/.well-known/jwks.json
     */
    loginProjectWellKnownJwksJsonDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<JsonWebKey, any>({
        path: `/v1/login/project/${projectId}/.well-known/jwks.json`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description A mechanism for an OpenID Connect Relying Party to discover the End-User's  OpenID Provider and obtain information needed to interact with it, including  its OAuth 2.0 endpoint locations.
     *
     * @tags idp
     * @name LoginProjectWellKnownOpenidConfigurationDetail
     * @summary OpenID Connect Discovery
     * @request GET:/v1/login/project/{projectId}/.well-known/openid-configuration
     */
    loginProjectWellKnownOpenidConfigurationDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<OIDCConfig, any>({
        path: `/v1/login/project/${projectId}/.well-known/openid-configuration`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description The authorization endpoint is one of the components in the OAuth 2.0 flow. It's the URL where a user is redirected to grant or deny access to their resources. When a user tries to access a service that requires OAuth 2.0 authorization, the application will redirect the user to this authorization endpoint. Here, the user can log in (if necessary) and then decide whether to grant the application access.
     *
     * @tags idp
     * @name LoginProjectOauth2AuthDetail
     * @summary OAuth 2.0 Authorize Endpoint
     * @request GET:/v1/login/project/{projectId}/oauth2/auth
     */
    loginProjectOauth2AuthDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/v1/login/project/${projectId}/oauth2/auth`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description Revoking a token (both access and refresh) means that the tokens will be invalid.  A revoked access token can no longer be used to make access requests, and a revoked  refresh token can no longer be used to refresh an access token. Revoking a refresh  token also invalidates the access token that was created with it. A token may only  be revoked by the client the token was generated for.
     *
     * @tags idp
     * @name LoginProjectOauth2RevokeCreate
     * @summary Revoke OAuth 2.0 Access or Refresh Token
     * @request POST:/v1/login/project/{projectId}/oauth2/revoke
     */
    loginProjectOauth2RevokeCreate: (projectId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1/login/project/${projectId}/oauth2/revoke`,
        method: 'POST',
        ...params,
      }),

    /**
     * @description This endpoint initiates and completes user logout at the IdP OAuth2 & OpenID provider and initiates OpenID Connect Front- / Back-channel logout: https://openid.net/specs/openid-connect-frontchannel-1_0.html https://openid.net/specs/openid-connect-backchannel-1_0.html Back-channel logout is performed asynchronously and does not affect logout flow.
     *
     * @tags idp
     * @name LoginProjectOauth2SessionsLogoutDetail
     * @summary OpenID Connect Front- and Back-channel Enabled Logout
     * @request GET:/v1/login/project/{projectId}/oauth2/sessions/logout
     */
    loginProjectOauth2SessionsLogoutDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/v1/login/project/${projectId}/oauth2/sessions/logout`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description The token endpoint is a critical component in the OAuth 2.0 protocol. It's the URL where a client application makes a request to exchange an authorization grant (such as an authorization code) for an access token. After a user grants authorization at the authorization endpoint, the client application receives an authorization grant, which is then exchanged for an access token at the token endpoint. This access token is then used to access the user's resources on the protected server.
     *
     * @tags idp
     * @name LoginProjectOauth2TokenCreate
     * @summary The OAuth 2.0 Token Endpoint
     * @request POST:/v1/login/project/{projectId}/oauth2/token
     */
    loginProjectOauth2TokenCreate: (projectId: string, params: RequestParams = {}) =>
      this.request<OAuth2Token, any>({
        path: `/v1/login/project/${projectId}/oauth2/token`,
        method: 'POST',
        ...params,
      }),

    /**
     * @description This endpoint returns the payload of the ID Token,  including session.id_token values, of the provided  OAuth 2.0 Access Token's consent request. In the case of authentication error, a WWW-Authenticate  header might be set in the response with more information  about the error. See the spec for more details about  header format.
     *
     * @tags idp
     * @name LoginProjectUserinfoDetail
     * @summary OpenID Connect Userinfo
     * @request GET:/v1/login/project/{projectId}/userinfo
     */
    loginProjectUserinfoDetail: (projectId: string, params: RequestParams = {}) =>
      this.request<GetUserInfo, any>({
        path: `/v1/login/project/${projectId}/userinfo`,
        method: 'GET',
        ...params,
      }),
  }
}
