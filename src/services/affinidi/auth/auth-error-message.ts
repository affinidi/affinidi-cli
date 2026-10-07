// Maps the error the BFF reports on the login callback to what the user should do next.
export const authErrorMessage = (type?: string, description?: string): string => {
  if (type !== 'access_denied') {
    return 'Unexpected error occurred'
  }

  switch (description) {
    case 'request_declined':
      return 'You have declined access to your data. Granting access to your data is necessary to avail our services.'
    case 'terms_declined':
      return `You must accept the Terms and Conditions to use Affinidi CLI. Run 'affinidi start' to try again.`
    default:
      return 'Access denied.'
  }
}
