let fetch = global.fetch
let URL = global.URL

const TESTMAIL_API_URL = 'https://api.testmail.app/api/json'
const TESTMAIL_INBOX_DOMAIN = 'inbox.testmail.app'
const tag = 'cli-integration-test'
interface InboxOptions {
  tag: string
  apiKey: string
  namespace: string
}

interface Email {
  subject: string
  body: string
}

// NOTE: Only use this helper when you need to read inbox contents
//       For email generation use generateEmail() helper instead
export class TestMailInbox {
  private _tag: string

  private _email: string

  private _lastEmailTimestamp: number

  private _apiKey: string

  private _namespace: string

  constructor({ tag, apiKey, namespace }: InboxOptions) {
    this._tag = tag
    this._email = `${namespace}.${this._tag}@${TESTMAIL_INBOX_DOMAIN}`

    // if inbox has already been used, ignore its old emails (1 minute is arbitrary)
    this._lastEmailTimestamp = Date.now() /*- 60_000*/

    this._apiKey = apiKey || ''
    this._namespace = namespace || ''
  }

  public async waitForNewEmail(): Promise<Email> {
    const url = new URL(TESTMAIL_API_URL)
    url.searchParams.append('apikey', this._apiKey)
    url.searchParams.append('namespace', this._namespace)
    url.searchParams.append('tag', this._tag)
    url.searchParams.append('timestamp_from', String(this._lastEmailTimestamp + 1))
    url.searchParams.append('livequery', 'true')

    const response = await (await fetch(url.toString())).json()

    if (!response.emails.length) {
      return {
        subject: '',
        body: '',
      }
    }

    const { subject, html, text, timestamp } = response.emails[0]
    this._lastEmailTimestamp = timestamp

    return {
      subject,
      body: text || html,
    }
  }

  public get email(): string {
    return this._email
  }
}
export const testInbox = new TestMailInbox({
  tag,
  apiKey: ,
  namespace: '',
})
