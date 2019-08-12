const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
const { Spinner } = require('../helpers/spinner')
const { signIn, getActivities, startTracking, getCurrentTracking, stopTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor, interactionColor, errorColor } = require('../helpers/colors')

async function stopActivity (activityName, options) {
  const spinner = new Spinner(feedbackColor(`logging in to Timeular API`))
  const spinner2 = new Spinner(feedbackColor(`getting current active tracking`))
  try {
    spinner.start()
    const token = await signIn()
    spinner.end()

    spinner2.start()
    const currentTracking = await getCurrentTracking(token)
    if (!currentTracking) {
      throw Error(`found no running activities to stop`)
    } else {
      spinner.update(feedbackColor('current tracking found. Stopping current tracking'))
      await stopTracking(token, currentTracking.activity.id)
    }
    spinner2.end()
  } catch (err) {
    spinner.end()
    spinner2.end()
    console.log((err.response && err.response.data) || err)
  }
}

module.exports = { stopActivity }