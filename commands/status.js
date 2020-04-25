const { Spinner } = require('../helpers/spinner')
const { signIn, getCurrentTracking } = require('../helpers/timeular-api-helpers')
const { feedbackColor } = require('../helpers/colors')
const parse = require('../helpers/trackingParser')

const status = async () => {
  const spinner = new Spinner(feedbackColor('logging in to Timeular API'))
  const spinner2 = new Spinner(feedbackColor('getting current active tracking'))
  try {
    spinner.start()
    const token = await signIn()
    spinner.end()

    spinner2.start()
    const currentTracking = await getCurrentTracking(token)
    spinner2.end()
    if (!currentTracking) {
      console.log(feedbackColor('Currently not tracking any activity'))
    } else {
      console.log(feedbackColor('Currently tracking: ' + parse(currentTracking)))
    }
  } catch (err) {
    spinner.end()
    spinner2.end()
    console.log((err.response && err.response.data) || err)
  }
}

module.exports = status
