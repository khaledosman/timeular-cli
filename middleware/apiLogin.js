const HttpStatus = require('http-status')

const { Spinner } = require('../helpers/spinner')
const { signIn } = require('../helpers/timeular-api-helpers')

const apiLogin = async argv => {
  const spinner = new Spinner('Logging in to Timeular API...')
  try {
    spinner.start()
    const apiToken = await signIn()
    spinner.end()
    return { ...argv, apiToken }
  } catch (err) {
    spinner.end()
    const { response } = err
    throw response ? new Error(`Login to Timeular failed: ${_responseDetails(response)}`) : err
  }
}

const _responseDetails = response => {
  switch (response.status) {
    case HttpStatus.BAD_REQUEST:
      return 'missing credentials'
    case HttpStatus.UNAUTHORIZED:
      return 'invalid credentials'
    default:
      return 'unknown error'
  }
}

module.exports = apiLogin
