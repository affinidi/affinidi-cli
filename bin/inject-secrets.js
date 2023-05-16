const replace = require('replace-in-file')
const options = [
  {
    files: 'dist/services/analytics/index.js',
    from: /<ANALYTICS_JWT_TOKEN>/g,
    to: process.env.ANALYTICS_JWT_TOKEN,
  },
  {
    files: 'dist/exposedFunctions/genApp.js',
    from: /<ISSUER_HASH_PASSWORD>/g,
    to: process.env.ISSUER_HASH_PASSWORD,
  },
]

const results = options.map((option) => {
  try {
    return replace.sync(option)
  } catch (error) {
    console.log(`Replacement fails for ${option.from}: `, error.message)
    throw error
  }
})

results.forEach((result, index) => {
  console.log(`Replacement results for ${options[index].from}:`, result)

  if (result.length !== 1 || !result[0].hasChanged) {
    throw new Error(`Fatal error while injecting an ${options[index].from}`)
  }
})
