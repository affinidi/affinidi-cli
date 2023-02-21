import { exec } from 'child_process'
import mv from 'mv'
import fs from 'fs'
import { UseCasesAppNames } from '../../exposedFunctions/genApp'

const PORTABLE_REP_GITHUB = 'https://github.com/affinidi/reference-app-portable-rep.git'
const REFERENCE_APP_GITHUB =
  'https://github.com/affinidi/reference-app-certification-and-verification.git'

export class GitService {
  public static clone = async (useCase: string, destination: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const repository =
        useCase === UseCasesAppNames.portableReputation ? PORTABLE_REP_GITHUB : REFERENCE_APP_GITHUB

      exec(`git clone ${repository} "${process.cwd()}/temp-app"`, (e) => {
        if (e) {
          reject(e)
        }
        mv(`${process.cwd()}/temp-app/use-cases/${useCase}`, `${destination}`, (error) => {
          if (error) {
            reject(error)
          }
          fs.rmSync(`${process.cwd()}/temp-app`, { recursive: true, force: true })

          resolve()
        })
      })
    })
  }
}
