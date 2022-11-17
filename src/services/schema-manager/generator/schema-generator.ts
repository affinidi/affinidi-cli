import {
  SchemaField,
  SchemaFieldType,
  SchemaHeaderField,
  VcJsonSchema,
  VcJsonSchemaProperty,
  VcJsonSchemeCredentialSubject,
} from './types'
import { mapSchemaFieldType } from './mapping'

const buildSchema = (
  header: SchemaHeaderField,
  credentialSubject: VcJsonSchemeCredentialSubject,
): VcJsonSchema => ({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: header.jsonSchemaUrl,
  $metadata: {
    version: header.version,
    revision: header.revision,
    discoverable: header.discoverable ?? true,
    uris: {
      jsonLdContext: header.jsonLdContextUrl,
      jsonSchema: header.jsonSchemaUrl,
    },
  },
  title: header.type,
  description: header.description,
  type: 'object',
  required: ['@context', 'type', 'issuer', 'issuanceDate', 'credentialSubject'],
  properties: {
    '@context': {
      type: ['string', 'array', 'object'],
    },
    id: {
      type: 'string',
      format: 'uri',
    },
    type: {
      type: ['string', 'array'],
      items: {
        type: 'string',
      },
    },
    issuer: {
      type: ['string', 'object'],
      format: 'uri',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          format: 'uri',
        },
      },
    },
    issuanceDate: {
      type: 'string',
      format: 'date-time',
    },
    expirationDate: {
      type: 'string',
      format: 'date-time',
    },
    credentialSubject,
    credentialSchema: {
      type: 'object',
      required: ['id', 'type'],
      properties: {
        id: {
          type: 'string',
          format: 'uri',
        },
        type: {
          type: 'string',
        },
      },
    },
  },
})
const buildCredentialSubjectPropertiesFromFields = (
  fields?: SchemaField[],
): { [k: string]: VcJsonSchemaProperty } =>
  fields?.reduce?.(
    (res, field) => ({
      ...res,
      [field.name]: buildCredentialSubjectField(field),
    }),
    {},
  ) ?? {}

const buildCredentialSubjectField = (field: SchemaField): VcJsonSchemaProperty => {
  const { name, description, type, nested } = field
  const property = {
    title: name,
    ...mapSchemaFieldType(type),
    ...(typeof description === 'string' && { description }),
  }

  if (type !== SchemaFieldType.Object) {
    return property
  }

  const subProperties = buildCredentialSubjectPropertiesFromFields(nested)
  const required = nested?.filter?.((e) => e.required).map((e) => e.name) || []

  return { ...property, properties: subProperties, required }
}

export const generateSchema = (header: SchemaHeaderField, fields: SchemaField[]): VcJsonSchema => {
  const properties = buildCredentialSubjectPropertiesFromFields(fields)
  const required = fields.filter((e) => e.required).map((e) => e.name)

  const credentialSubject = { type: 'object', properties, required }

  return buildSchema(header, credentialSubject)
}
