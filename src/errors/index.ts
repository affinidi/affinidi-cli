const pleaseTryAgain = 'Please try again later.'
const somethingWentWrong = `Something went wrong. ${pleaseTryAgain}`

export const WrongEmailError = Error('Invalid email address entered. Exiting the program.')
export const ServiceDownError = Error(somethingWentWrong)
export const InvalidOrExpiredOTPError = Error('The OTP was either invalid or expired')
export const SignoutError = Error('There was an error while trying to sign-out')
export const Unauthorized = Error(
  "You are not authorized to perform this action. Try logging in or sign-up if you don't have an account",
)
export const couldNotParseSchema = Error(
  'Could not parse schema URL, please provide a valid schema URl',
)
export const emptyIssueDataFlag = Error('Please enter a directory to a json file.')
export const noSuchFileOrDir = Error('Please provide a vaild directory for the json file')
export const badRequest = Error('Please check that your json file content is in the right format')
