const { Input, NumberPrompt } = require('enquirer')
const { sortBy } = require('lodash')

const { Spinner } = require('../helpers/spinner')
const { getActivities, startTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')
const parse = require('../helpers/trackingParser')
const stop = require('./stop')

const start = async argv => {
  const { apiToken, activityName } = argv
  const spinner = new Spinner(feedbackColor('Getting available activities...'))
  const spinner2 = new Spinner(feedbackColor('Start tracking...'))
  try {
    const activities = await getActivities(apiToken)
    spinner.end()

    const activity = await _getActivity(activityName, activities)
    if (!activity) {
      throw new Error('Activity not found')
    }
    const message = argv.message || await _getMessageFromInput()

    spinner2.start()
    await _stopPrevious(argv)

    const newActivity = await startTracking(apiToken, activity.id, message)
    spinner2.end()
    console.log('Started tracking: ' + parse(newActivity))
  } catch (err) {
    spinner.end()
    spinner2.end()
    throw err
  }
}

const _getActivity = async (activityName, activities = []) => {
  if (!activityName) {
    activityName = await _getActivityFromInput(activities)
  }
  return activities.find(a => a.name === activityName)
}

const _getActivityFromInput = async activities => {
  activities = sortBy(activities, 'name')
  activities.forEach((activity, index) => {
    console.log(`${index}\t${activity.name}`)
  })
  const index = await _promptIndex(activities)
  return activities[index].name
}

const _promptIndex = async activities => new NumberPrompt({
  name: 'index',
  message: 'Number of activity to track:',
  validate: i => i >= 0 && i < activities.length
}).run()

const _getMessageFromInput = async () => new Input({
  message: 'Note:'
}).run()

const _stopPrevious = async argv => {
  try {
    await stop(argv)
  } catch (err) {
    if (err.message !== 'No running activity - nothing to stop') {
      throw err
    }
  }
}

module.exports = start
