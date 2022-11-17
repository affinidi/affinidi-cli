import { SchemaFieldType, VcJsonSchemaProperty } from './types'

const schemaFieldTypeMapping: Record<SchemaFieldType, { type: string; format?: string }> = {
  [SchemaFieldType.Text]: { type: 'string' },
  [SchemaFieldType.DID]: { type: 'string', format: 'did' },
  [SchemaFieldType.URI]: { type: 'string', format: 'uri' },
  [SchemaFieldType.Date]: { type: 'string', format: 'date' },
  [SchemaFieldType.DateTime]: { type: 'string', format: 'date-time' },
  [SchemaFieldType.Number]: { type: 'number' },
  [SchemaFieldType.Boolean]: { type: 'boolean' },
  [SchemaFieldType.Object]: { type: 'object' },
}

export const mapSchemaFieldType = (type: SchemaFieldType) => schemaFieldTypeMapping[type]

export const mapVcSchemaJsonType = ({ type, format }: VcJsonSchemaProperty) =>
  Object.entries(schemaFieldTypeMapping).find(
    ([, v]) => v.type === type && v.format === format,
  )?.[0] as SchemaFieldType
