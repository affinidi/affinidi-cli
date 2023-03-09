const replace = require('replace-in-file');
const options = {
  files: 'dist/services/analytics/index.js',
  from: /ANALYTICS_JWT_TOKEN/g,
  to: process.env.ANALYTICS_JWT_TOKEN,
};


const results = replace.sync(options);

console.log('Replacement results:', results);

if (results.length !== 1 || !results[0].hasChanged ) {
  throw new Error("Fatal error while injecting an analytics token")
}

