import { StatusCodes } from 'http-status-codes'
import { buildInvalidCommandUsage, wrapError } from '../render/texts'

const pleaseTryAgain = 'Please try again later.'
const somethingWentWrong = `Something went wrong. ${pleaseTryAgain}`

export const WrongEmailError = 'Invalid email address entered'
export const ServiceDownError = somethingWentWrong
export const InvalidOrExpiredOTPError = 'The confirmation code entered is either invalid or expired'
export const SignoutError = `There was an error while trying to sign-out. ${pleaseTryAgain}`
export const Unauthorized =
  'You are not authorized to perform this action. Please try to log-in, sign-up or make sure you have an active project'
export const notFoundProject = 'Please provide an existing project ID or activate a project.'

export const CouldNotParseSchema = 'Could not parse schema URL, please provide a valid schema URl'
export const EmptyIssueDataFlag = 'Please enter a directory to a json file.'
export const NoSuchFileOrDir = 'Please provide a vaild directory for the json file'
export const issuanceBadRequest =
  'Please check that your json file content is in the right structure as in the schema.'
export const WrongFileType = 'Please provide a valid '
export const WrongSchemaFileType =
  'Please provide a valid file directory with the right extension (.json).'
export const JsonFileSyntaxError = 'Please check syntax of json file and try again.'
export const NotFoundEmail =
  "Please enter the email address you signed-up with or sign-up if you don't have an account."
export const NotFound =
  "Please enter the email address you signed-up with or sign-up if you don't have an account."
export const Conflict = 'This email has already been registered, please use the login command.'
export const verifierBadRequest = 'Please make sure that the VC is valid.'
export const schemaBadrequest = 'Please make sure to provide a valid schema credential subject.'
export const notFoundSchema = 'Please provide an existing schema ID.'
export const InvalidSchemaName = 'Please, enter a schema name using only alpha numeric characters'
export const NotSupportedPlatform = 'This platform is not supported.'
export const InvalidUseCase = 'Invalid use-case'
export class CliError extends Error {
  code: number

  service: string

  args: {
    name: string
  }[]

  constructor(message: string, code: number, service: string) {
    super(message)
    Object.setPrototypeOf(this, CliError.prototype)
    this.code = code
    this.service = service
    this.message = message
  }
}

const handleBadRequest = (service: string): string => {
  switch (service) {
    case 'userManagement':
      return InvalidOrExpiredOTPError
    case 'issuance':
      return issuanceBadRequest
    case 'verification':
      return verifierBadRequest
    case 'schema':
      return schemaBadrequest
    default:
      return 'IAm service bad request'
  }
}
const handleNotFound = (service: string): string => {
  switch (service) {
    case 'iAm':
      return notFoundProject
    case 'userManagement':
      return NotFoundEmail
    case 'schema':
      return notFoundSchema
    default:
      return 'Service not found'
  }
}

const handleResponseErrors = (error: CliError): string => {
  switch (error.code) {
    case StatusCodes.FORBIDDEN:
    case StatusCodes.UNAUTHORIZED:
      return Unauthorized
    case StatusCodes.INTERNAL_SERVER_ERROR:
      return ServiceDownError
    case StatusCodes.BAD_REQUEST:
      return handleBadRequest(error.service)
    case StatusCodes.NOT_FOUND:
      return handleNotFound(error.service)
    case StatusCodes.CONFLICT:
      return Conflict
    default:
      return error?.message
  }
}

export const getErrorOutput = (
  error: CliError,
  command: string,
  usage: string,
  summary: string,
): string => {
  if (error.args) {
    const missingArgs: string[] = []
    if (error.args) {
      error.args.forEach((arg) => {
        missingArgs.push(arg.name)
      })
    }
    return buildInvalidCommandUsage(command, usage, summary, missingArgs)
  }
  return wrapError(handleResponseErrors(error))
}
