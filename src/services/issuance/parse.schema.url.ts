import { CouldNotParseSchema } from '../../errors/index'

const SCHEMA_TYPE_UI_VIEW_REGEX = /\/schemas\/(.*)V([0-9]+)-([0-9]+)/
const SCHEMA_TYPE_CONTEXT_OR_SCHEMA_REGEX =
  /(@did:[^/]+|\.org|\.com)\/(.*)V([0-9]+)-([0-9]+)\.(json|jsonld)/

type ParsedSchemaType = {
  type: string
  short: string
  v: string
  i: string
}

function parseSchemaTypeFromUIURL(url: URL): ParsedSchemaType | undefined {
  const { pathname } = url
  const match = pathname.match(SCHEMA_TYPE_UI_VIEW_REGEX)

  if (!match) {
    return undefined
  }

  if (match[1].startsWith('@did')) {
    const [, ...rest] = match[1].split('/')

    return { type: match[1], short: rest.join('/'), v: match[2], i: match[3] }
  }

  return { type: match[1], short: match[1], v: match[2], i: match[3] }
}

function parseSchemaTypeFromContextOrSchemaURL(url: URL): ParsedSchemaType | undefined {
  const match = url.toString().match(SCHEMA_TYPE_CONTEXT_OR_SCHEMA_REGEX)

  if (!match) {
    return undefined
  }

  if (match[2].startsWith('@did')) {
    const [, ...rest] = match[2].split('/')

    return { type: match[2], short: rest.join('/'), v: match[3], i: match[4] }
  }

  return { type: match[2], short: match[2], v: match[3], i: match[4] }
}

function parseSchemaType(url: URL): ParsedSchemaType {
  const fromUIURL = parseSchemaTypeFromUIURL(url)

  if (fromUIURL) {
    return fromUIURL
  }

  const fromContextOrSchemaURL = parseSchemaTypeFromContextOrSchemaURL(url)

  if (fromContextOrSchemaURL) {
    return fromContextOrSchemaURL
  }

  throw new Error('could not match pathname')
}

function getBase(host: string): string {
  switch (host) {
    case 'ui.schema.dev.affinidi.com':
    case 'schema-manager.dev.affinity-project.org':
      return 'https://schema-manager.dev.affinity-project.org'
    case 'ui.schema.stg.affinidi.com':
    case 'schema.stg.affinidi.com':
      return 'https://schema.stg.affinidi.com'
    case 'ui.schema.affinidi.com':
    case 'schema.affinidi.com':
      return 'https://schema.affinidi.com'
    default:
      throw new Error(`unknown host: ${host}`)
  }
}

export function parseSchemaURL(schemaURL: string): {
  schemaType: string
  jsonLdContext: URL
  jsonSchema: URL
} {
  try {
    const url = new URL(schemaURL)

    const { type, short, v, i } = parseSchemaType(url)
    const fullSchemaType = `${type}V${v}-${i}`

    const base = getBase(url.host)

    return {
      schemaType: short,
      jsonLdContext: new URL(`${base}/${fullSchemaType}.jsonld`),
      jsonSchema: new URL(`${base}/${fullSchemaType}.json`),
    }
  } catch (_) {
    throw CouldNotParseSchema
  }
}
