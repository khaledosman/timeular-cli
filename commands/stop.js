const { Spinner } = require('../helpers/spinner')
const { getCurrentTracking, stopTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')
const parse = require('../helpers/trackingParser')

const stop = async argv => {
  const { apiToken } = argv
  const spinner = new Spinner(feedbackColor('getting current active tracking'))
  try {
    spinner.start()
    const currentTracking = await getCurrentTracking(apiToken)
    if (!currentTracking) {
      throw Error('No running activity - nothing to stop')
    }
    spinner.update(feedbackColor('current tracking found. Stopping current tracking'))
    const timeEntry = await stopTracking(apiToken, currentTracking.activity.id)
    spinner.end()
    console.log('Stopped tracking: ' + parse(timeEntry))
  } catch (err) {
    spinner.end()
    throw err
  }
}

module.exports = stop
