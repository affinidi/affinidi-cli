import * as fs from 'fs'
import { analyticsService } from '.'
import { EventDTO } from './analytics.api'

const check = fs.readFileSync('./file.txt', 'utf-8')
const analyticsData: EventDTO = {
  name: 'CLI_ANALYTICS_ENABLED',
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
