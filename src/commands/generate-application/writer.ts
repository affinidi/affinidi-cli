import fs from 'fs'

export class Writer {
  public static write = (path: string, lines: string[]): void => {
    const stream = fs.createWriteStream(path, {
      flags: 'a',
    })

    lines.forEach((line: string) => {
      stream.write(`${line}\n`)
    })
  }
}
