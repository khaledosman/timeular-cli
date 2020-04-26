const chalk = require('chalk')
const { sortBy } = require('lodash')

const { Spinner } = require('../helpers/spinner')
const { signIn, getActivities, getCurrentTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')

const listActivities = async () => {
  const spinner = new Spinner(feedbackColor('logging in to Timeular API'))
  try {
    spinner.start()
    const token = await signIn()
    spinner.update(feedbackColor('getting available activities'))
    const activities = await getActivities(token)
    spinner.update(feedbackColor('getting current activity'))
    const currentActivityName = await _getCurrentActivity(token)
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
