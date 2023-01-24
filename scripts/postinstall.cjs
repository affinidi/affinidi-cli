const  fs = require('fs')
const { env } = require('process')
// const { analyticsService } = require('../src/services/analytics/index')


const isGlobal = env.npm_config_global === 'true'
if (isGlobal) {
  const check = fs.readFileSync('./file.txt', 'utf-8')
  const analyticsData = {
    name: 'CLI_INSTALLED',
    category: 'APPLICATION',
    component: 'Cli',
    uuid: '',
    metadata: {},
  }
  if (check === 'installation') {
    analyticsService.eventsControllerSend(analyticsData)
  }
  fs.unlink('./file.txt', (err) => {
    if (err) console.log('cannot delete file')
  })
}