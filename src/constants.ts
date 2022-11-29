/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import rootPath from 'app-root-path'

const loadJSON = (path: string): any => {
  try {
    const d = fs.readFileSync(path, 'utf8')
    return JSON.parse(d)
  } catch (err) {
    console.error('impossible to load json file', err)
    return undefined
  }
}

const packageJsonPath = `${rootPath}/package.json`
const pjson = loadJSON(packageJsonPath)
export const version = pjson && pjson.version ? pjson.version : '0.0.0'
