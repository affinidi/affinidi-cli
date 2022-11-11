import { exec } from 'child_process'

export class GitService {
  public static clone = async (repository: string, destination: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      exec(`git clone ${repository} "${destination}"`, (error) => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })
  }
}
