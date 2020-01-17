const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
const { Spinner } = require('../helpers/spinner')
const { signIn, getActivities, startTracking, getCurrentTracking, stopTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor, interactionColor, errorColor } = require('../helpers/colors')

async function startActivity (activityName) {
  const spinner = new Spinner(feedbackColor('logging in to Timeular API'))
  const spinner2 = new Spinner(feedbackColor('getting current active tracking'))
  try {
    spinner.start()
    const token = await signIn()
    spinner.update(feedbackColor('getting available activities'))
    const activities = await getActivities(token)
    spinner.end()
    const activity = await _getActivity(activityName, activities)

    if (!activity || !activity.id) {
      console.error(errorColor('activity not found'))
      process.exit(1)
    }
    const activityId = activity.id

    spinner2.start()
    const currentTracking = await getCurrentTracking(token)
    if (!currentTracking) {
      spinner.update(feedbackColor('starting tracking'))
      await startTracking(token, activityId)
    } else {
      spinner.update(feedbackColor('current tracking found. Stopping current tracking'))
      await stopTracking(token, currentTracking.activity.id)
      spinner.update(feedbackColor('starting new tracking'))
      await startTracking(token, activityId)
    }
    spinner2.end()
    console.log(feedbackColor(`started tracking activity ${activity.name} with id ${activityId}`))
  } catch (err) {
    spinner.end()
    spinner2.end()
    console.log((err.response && err.response.data) || err)
  }
}

async function _getActivity (activityName, activities) {
  let activity
  if (!activityName) {
    const answers = await getActivityNameFromInput(activities)
    activityName = answers.activityName
    activity = activities.find(a => a.name === answers.activityName)
  } else {
    activity = activities.find(a => a.name === activityName)
  }
  return activity
}
function getActivityNameFromInput (activities) {
  return inquirer
    .prompt({
      type: 'autocomplete',
      name: 'activityName',
      message: interactionColor('Please select an activity'),
      source: (answersSoFar, input) => {
        const labels = activities.map(a => a.name)
        if (!input) {
          return Promise.resolve(labels)
        } else {
          const results = fuzzy.filter(input, labels)
          return Promise.resolve(results.map(({ string, score, index, original }) => labels[index]))
        }
      }
    })
}
module.exports = { startActivity }
