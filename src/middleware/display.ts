import { ux } from '@oclif/core'
import { wrapError } from '../render/texts'
import { configService } from '../services'

export interface DisplayOptions {
  itemToDisplay: string
  flag?: string
  err?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonToPlainText = (jsonObject: any, result: string[]): string => {
  if (typeof jsonObject !== 'object') {
    return result.join('\n')
  }
  Object.keys(jsonObject).forEach((key): string => {
    if (typeof jsonObject[key] === 'object') {
      const newResult = result
      if (Number.isNaN(Number(key))) {
        newResult.push(`\n${key} :`)
      } else {
        newResult.push(`\n${Number(key) + 1} :`)
      }
      return jsonToPlainText(jsonObject[key], newResult)
    }
    if (typeof jsonObject[key] !== 'object') {
      const newResult = result
      newResult.push(`${key} : ${jsonObject[key]}`)
      return jsonToPlainText(jsonObject[key], newResult)
    }
    return result.join('\n')
  })
  return result.join('\n')
}

const buildJSONMessage = (message: string): string => {
  let messageSplit: string[]
  const ansiCodeRegex = new RegExp(
    /(\\u001b)(8|7|H|>|\[(\?\d+(h|l)|[0-2]?(K|J)|\d*(A|B|C|D\D|E|F|G|g|i|m|n|S|s|T|u)|1000D\d+|\d*;\d*(f|H|r|m)|\d+;\d+;\d+m))/g,
  )
  if (message.includes('\n')) {
    messageSplit = message.split('\n')
  }
  const jsonMessage = JSON.stringify({ Message: messageSplit || message }, null, ' ')
  const jsonCleanMessage = jsonMessage.replace(ansiCodeRegex, '')
  return jsonCleanMessage
}

export const displayOutput = (displayOptions: DisplayOptions) => {
  const outputFormat = displayOptions.flag || configService.getOutputFormat()
  let formattedOutput = displayOptions.itemToDisplay
  const nullRegex = new RegExp('null', 'g')

  if (outputFormat === 'plaintext') {
    try {
      const nullRemoved = displayOptions.itemToDisplay.replace(nullRegex, '"null"')
      const jsonObject = JSON.parse(nullRemoved)
      formattedOutput = jsonToPlainText(jsonObject, [])
    } catch (error) {
      formattedOutput = displayOptions.itemToDisplay
    }
  } else {
    try {
      JSON.parse(displayOptions.itemToDisplay)
    } catch (error) {
      formattedOutput = buildJSONMessage(displayOptions.itemToDisplay)
    }
  }
  if (displayOptions.err) {
    ux.info(wrapError(formattedOutput, displayOptions.err))
    return
  }
  ux.info(formattedOutput)
}
