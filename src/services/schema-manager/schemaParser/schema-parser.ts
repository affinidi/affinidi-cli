import {
  SchemaField,
  SchemaFieldType,
  SchemaHeaderField,
  VcJsonSchema,
  VcJsonSchemaProperty,
} from '../generator/types'
import { mapVcSchemaJsonType } from '../generator/mapping'

type VcJsonSchemaPropWithNested = {
  properties: Record<string, VcJsonSchemaProperty>
  required?: string[]
}

const parseVcJsonSchemaProperty = (
  prop: VcJsonSchemaProperty,
  isRequired: boolean,
): SchemaField => ({
  name: prop.title,
  type: mapVcSchemaJsonType(prop),
  description: prop.description,
  required: isRequired,
  nested:
    (mapVcSchemaJsonType(prop) === SchemaFieldType.Object &&
      prop.properties &&
      parseProperties(prop as VcJsonSchemaPropWithNested)) ||
    undefined,
})

const parseProperties = ({ properties, required }: VcJsonSchemaPropWithNested) => {
  return (
    properties &&
    Object.values(properties).map((p) =>
      parseVcJsonSchemaProperty(p, required?.includes?.(p.title) ?? false),
    )
  )
}

export const parseSchema = (
  schema: VcJsonSchema,
): { header: SchemaHeaderField; fields: SchemaField[] } => ({
  header: {
    type: schema?.title,
    description: schema?.description,
    version: schema?.$metadata?.version,
    revision: schema?.$metadata?.revision,
    jsonSchemaUrl: schema?.$metadata?.uris?.jsonSchema,
    jsonLdContextUrl: schema?.$metadata?.uris?.jsonLdContext,
  },
  fields: parseProperties(schema?.properties?.credentialSubject) ?? [],
})
