import { generateContext } from './context-generator'
import { generateSchema } from './schema-generator'
import { SchemaField, SchemaHeaderField } from './types'

export interface Options {
  namespace?: string
  type: string
  version: number
  revision: number
}

export const generateSchemaId = ({ namespace, type, version, revision }: Options) => {
  const namespacePart = namespace ? `@${namespace}/` : ''
  return `${namespacePart}${type}V${version}-${revision}`
}
export const getNextVersion = ({ version, revision }: { version: number; revision: number }) =>
  revision === 999 ? [version + 1, 0] : [version, revision + 1]

export const generateSchemaFilesMetadata = (
  host: string,
  schemaId: string,
): {
  jsonSchemaFilename: string
  jsonLdContextFilename: string
  jsonSchemaUrl: string
  jsonLdContextUrl: string
} => {
  const jsonSchemaFilename = `${schemaId}.json`
  const jsonLdContextFilename = `${schemaId}.jsonld`

  return {
    jsonSchemaFilename,
    jsonLdContextFilename,
    jsonSchemaUrl: `${host}/${jsonSchemaFilename}`,
    jsonLdContextUrl: `${host}/${jsonLdContextFilename}`,
  }
}
export const generate = (header: SchemaHeaderField, fields: SchemaField[]) => ({
  jsonSchema: generateSchema(header, fields),
  jsonLdContext: generateContext(header, fields),
})
