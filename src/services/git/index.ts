import { exec } from 'child_process'
import os from 'os'
import path from 'path'
import fs from 'fs-extra'

export class GitService {
  public static clone = async (
    repository: string,
    destination: string,
    options?: { subdirectory?: string },
  ): Promise<void> => {
    const cloneDir = options?.subdirectory
      ? await fs.mkdtemp(path.join(os.tmpdir(), 'affinidi-cli-'))
      : destination

    await new Promise<void>((resolve, reject) => {
      exec(`git clone ${repository} "${cloneDir}"`, (error) => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })

    if (options?.subdirectory) {
      const source = path.join(cloneDir, options.subdirectory)
      await fs.move(source, destination)
      await fs.remove(source).catch(() => {})
    }
  }
}
