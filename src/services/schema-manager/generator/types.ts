export enum SchemaFieldType {
  DID = 'did',
  Text = 'Text',
  URI = 'URL',
  Date = 'Date',
  DateTime = 'DateTime',
  Number = 'Number',
  Boolean = 'Boolean',
  Object = 'object',
}

/**
 * schemasHostingPath - the url path to the place where the schema will be hosted if public,
 * e.g.: https://public.schemas.affinidi.com/${schema-slug}
 * so, when GET request is made to this path the service will return this schema
 */
export type SchemaHeaderField = {
  discoverable?: boolean
  type: string
  description: string
  version: number
  revision: number
  jsonSchemaUrl: string
  jsonLdContextUrl: string
}

export type SchemaField = {
  name: string
  type: SchemaFieldType
  required: boolean
  description?: string
  nested?: SchemaField[]
}

export type GeneratorInputParams = {
  header: SchemaHeaderField
  fields: SchemaField[]
}

export type VcJsonLdContextField = {
  '@id': string
  '@type': string
  '@context'?: {
    '@version'?: number
    '@protected'?: boolean
    [k: string]: number | boolean | VcJsonLdContextField | undefined
  }
}

export type VcJsonLdContext = {
  '@context': {
    [k: string]: VcJsonLdContextField
  }
}

export type VcJsonSchemeCredentialSubject = {
  required?: string[]
  properties: {
    [k: string]: VcJsonSchemaProperty
  }
  [k: string]: any
}

export type VcJsonSchemaProperty = {
  title: string
  type: string
  format?: string
  description?: string
  required?: string[]
  properties?: {
    [k: string]: VcJsonSchemaProperty
  }
}

export type VcJsonSchema = {
  title: string
  description: string
  $id: string
  $metadata: {
    version: number
    revision: number
    discoverable: boolean
    uris: {
      jsonLdContext: string
      jsonSchema: string
      [k: string]: any
    }
    [k: string]: any
  }
  properties: {
    credentialSubject: VcJsonSchemeCredentialSubject
    [k: string]: any
  }
  [k: string]: any
}
