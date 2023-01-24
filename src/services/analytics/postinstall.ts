import * as fs from 'fs'
import { env } from 'process'
import { analyticsService } from '.'
import { EventDTO } from './analytics.api'

const isGlobal = env.npm_config_global === 'true'
if (isGlobal) {
  const check = fs.readFileSync('./file.txt', 'utf-8')
  const analyticsData: EventDTO = {
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
    if (err) throw err
  })
}
