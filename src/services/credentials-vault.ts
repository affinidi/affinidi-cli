import keytar from 'keytar'

const account = 'Affinidi'
const service = 'sessionID (@affinidi/cli)'

class CredentialsVault {
  async clear(): Promise<boolean> {
    return keytar.deletePassword(service, account)
  }

  getSessionId(): Promise<string | null> {
    return keytar.getPassword(service, account)
  }

  setSessionId(value: string): Promise<void> {
    return keytar.setPassword(service, account, value)
  }
}

export const credentialsVault = new CredentialsVault()
