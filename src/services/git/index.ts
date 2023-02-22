import { exec } from 'child_process'
import mv from 'mv'
import fs from 'fs'

export class GitService {
  public static clone = async (
    repository: string,
    useCase: string,
    destination: string,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repository} "${process.cwd()}/temp-app"`, (error) => {
        if (error) {
          reject(error)
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
