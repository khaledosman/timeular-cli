const { Spinner } = require('../helpers/spinner')
const { getCurrentTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')
const parse = require('../helpers/trackingParser')

const status = async argv => {
  const { apiToken } = argv
  const spinner = new Spinner(feedbackColor('getting current active tracking'))
  try {
    spinner.start()
    const currentTracking = await getCurrentTracking(apiToken)
    spinner.end()
    const output = currentTracking ? 'Currently tracking: ' + parse(currentTracking) : 'Currently not tracking any activity'
    console.log(output)
  } catch (err) {
    spinner.end()
    console.log((err.response && err.response.data && err.response.data.message) || err)
  }
}

module.exports = status
