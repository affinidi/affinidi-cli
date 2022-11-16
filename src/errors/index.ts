import { StatusCodes } from 'http-status-codes'

const pleaseTryAgain = 'Please try again later.'
const somethingWentWrong = `Something went wrong. ${pleaseTryAgain}`

export const WrongEmailError = Error('Invalid email address entered. Exiting the program.')
export const ServiceDownError = Error(somethingWentWrong)
export const InvalidOrExpiredOTPError = Error(
  'The confirmation code entered is either invalid or expired',
)
export const SignoutError = Error(`There was an error while trying to sign-out. ${pleaseTryAgain}`)
export const Unauthorized = Error(
  "You are not authorized to perform this action. Please try to log-in, sign-up if you don't have an account or make sure you have an active project",
)
export const notFoundProject = Error(
  'Please provide an existing project ID or activate a project in case trying to show active project.',
)
export const CouldNotParseSchema = Error(
  'Could not parse schema URL, please provide a valid schema URl',
)
export const EmptyIssueDataFlag = Error('Please enter a directory to a json file.')
export const issuanceBadRequest = Error(
  'Please check that your file content is matching the schema.',
)
export const WrongFileType = Error(
  'Please provide a valid file directory with the right extensions. (".csv" for bulk issuance or ".json" for single issuance)',
)
export const JsonFileSyntaxError = Error('Please check syntax of json file and try again.')
export const NotFoundEmail = Error(
  "Please enter the email address you signed-up with or sign-up if you don't have an account.",
)
export const Conflict = Error(
  'This email has already been registered, please use the login command.',
)
export const verifierBadRequest = Error('Please make sure that the VC is valid.')
export const schemaBadrequest = Error('Please make sure to provide a valid schema ID.')
export const NotFoundSchema = Error('Please provide an existing schema ID.')
export const NotSupportedPlatform = Error('This platform is not supported.')
export const InvalidUseCase = Error('Invalid use-case')

export class CliError extends Error {
  code: number

  service: string

  constructor(message: string, code: number, service: string) {
    super(message)
    Object.setPrototypeOf(this, CliError.prototype)
    this.code = code
    this.service = service
    this.message = message
  }
}
const handleBadRequest = (service: string): Error => {
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
      return new Error('IAm service bad request')
  }
}
const handleNotFound = (service: string): Error => {
  switch (service) {
    case 'iAm':
      return notFoundProject
    case 'userManagement':
      return NotFoundEmail
    case 'schema':
      return NotFoundSchema
    default:
      return new Error('Service not found')
  }
}

export const handleErrors = (error: CliError) => {
  switch (error.code) {
    case StatusCodes.FORBIDDEN:
    case StatusCodes.UNAUTHORIZED:
      throw Unauthorized
    case StatusCodes.INTERNAL_SERVER_ERROR:
      throw ServiceDownError
    case StatusCodes.BAD_REQUEST:
      throw handleBadRequest(error.service)
    case StatusCodes.NOT_FOUND:
      throw handleNotFound(error.service)
    case StatusCodes.CONFLICT:
      throw Conflict
    default:
      throw new Error(error?.message)
  }
}
