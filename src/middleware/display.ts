import { CliUx } from '@oclif/core'
import { configService } from '../services/config'

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
  const ansiCodeRegex = new RegExp(
    /(\\u001b)(8|7|H|>|\[(\?\d+(h|l)|[0-2]?(K|J)|\d*(A|B|C|D\D|E|F|G|g|i|m|n|S|s|T|u)|1000D\d+|\d*;\d*(f|H|r|m)|\d+;\d+;\d+m))/g,
  )

  const jsonMessage = JSON.stringify({ Message: message }, null, ' ')
  const jsonCleanMessage = jsonMessage.replace(ansiCodeRegex, '')
  return jsonCleanMessage
}

export const displayOutput = (itemToDisplay: string, flag?: string) => {
  const outputFormat = flag || configService.getOutputFormat()
  let formatedOutput = itemToDisplay
  const nullRegex = new RegExp('null', 'g')

  if (outputFormat === 'plaintext') {
    try {
      const nullRemoved = itemToDisplay.replace(nullRegex, '"null"')
      const jsonObject = JSON.parse(nullRemoved)
      formatedOutput = jsonToPlainText(jsonObject, [])
    } catch (error) {
      formatedOutput = itemToDisplay
    }
  } else {
    try {
      JSON.parse(itemToDisplay)
    } catch (error) {
      formatedOutput = buildJSONMessage(itemToDisplay)
    }
  }
  CliUx.ux.info(formatedOutput)
}
