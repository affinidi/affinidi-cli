export function giveFlagInputErrorMessage(name: string) {
  return `The --no-input flag disables interactive input. Please provide the value for "${name}" through a flag instead.`
}
