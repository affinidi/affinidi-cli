const pleaseTryAgain = 'Please try again later.'
const somethingWentWrong = `Something went wrong. ${pleaseTryAgain}`

export const WrongEmailError = Error('Invalid email address entered. Exiting the program.')
export const UserManagementServiceDownError = Error(somethingWentWrong)
export const InvalidOrExpiredOTPError = Error('The OTP was either invalid or expired')
export const SingoutError = Error('There was an error while trying to sign-out')
