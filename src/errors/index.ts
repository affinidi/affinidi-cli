const pleaseTryAgain = 'Please try again later.'
const somethingWentWrong = `Something went wrong. ${pleaseTryAgain}`

export const WrongEmailError = Error('Invalid email address entered. Exiting the program.')
export const ServiceDownError = Error(somethingWentWrong)
export const InvalidOrExpiredOTPError = Error('The OTP was either invalid or expired')
export const SignoutError = Error('There was an error while trying to sign-out')
export const Unauthorized = Error(
  "You are not authorized to perform this action. Try logging in or sign-up if you don't have an account",
)
