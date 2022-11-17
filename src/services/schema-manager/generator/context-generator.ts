import {
  SchemaField,
  SchemaFieldType,
  SchemaHeaderField,
  VcJsonLdContext,
  VcJsonLdContextField,
} from './types'

const SCHEMA_ORG_BASE_URL = 'https://schema.org/'

const mapType = (type: SchemaFieldType): string => {
  if (type === SchemaFieldType.DID) return '@id'
  if (type === SchemaFieldType.Object) return ''
  return `${SCHEMA_ORG_BASE_URL}${type}`
}

const buildJsonLdContext = (
  header: SchemaHeaderField,
  context: { [k: string]: VcJsonLdContextField },
): VcJsonLdContext => ({
  '@context': {
    [header.type]: {
      '@id': header.jsonLdContextUrl,
      '@context': { '@version': 1.1, '@protected': true },
    } as VcJsonLdContextField,
    ...context,
  },
})

const buildContextFromFields = (fields: SchemaField[]) =>
  fields.reduce(
    (res, e) => ({
      ...res,
      ...buildCredentialSubjectField(e),
    }),
    {},
  )

const buildCredentialSubjectField = (field: SchemaField) => {
  const billet = { [field.name]: { '@id': `schema-id:${field.name}` } }
  if (field.type !== SchemaFieldType.Object) {
    Object.assign(billet[field.name], { '@type': mapType(field.type) })
  } else {
    const subContext = buildContextFromFields(field.nested || [])

    Object.assign(billet[field.name], { '@context': subContext })
  }

  return billet
}

export const generateContext = (
  header: SchemaHeaderField,
  fields: SchemaField[],
): VcJsonLdContext => {
  const context = buildContextFromFields(fields)
  return buildJsonLdContext(header, context)
}
