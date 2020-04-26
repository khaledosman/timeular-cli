const chalk = require('chalk')
const { sortBy } = require('lodash')

const { Spinner } = require('../helpers/spinner')
const { getActivities, getCurrentTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')

const listActivities = async argv => {
  const { apiToken } = argv
  const spinner = new Spinner(feedbackColor('getting available activities'))
  try {
    spinner.start()
    const activities = await getActivities(apiToken)
    spinner.update(feedbackColor('getting current activity'))
    const currentActivityName = await _getCurrentActivity(apiToken)
    spinner.end()
    sortBy(activities, 'name').forEach((activity, index) => {
      const activityName = currentActivityName === activity.name ? chalk.bold(activity.name + ' \uF017') : activity.name
      console.log(`${index}\t${activityName}`)
    })
  } catch (err) {
    spinner.end()
    console.log((err.response && err.response.data) || err)
  }
}

const _getCurrentActivity = async token => {
  const tracking = await getCurrentTracking(token)
  if (!tracking || !tracking.activity) {
    return ''
  }
  return tracking.activity.name || ''
}

module.exports = listActivities
