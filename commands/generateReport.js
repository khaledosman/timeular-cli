const inquirer = require('inquirer')
const { Spinner } = require('../helpers/spinner')
const { signIn, downloadReport } = require('../helpers/timeular-api-helpers')
const { feedbackColor, interactionColor, errorColor } = require('../helpers/colors')
const fs = require('fs')

const questions = [{
  type: 'datepicker',
  name: 'startTime',
  message: 'Select a start time: ',
  format: 'llll',
  default: new Date(new Date().setHours(new Date().getHours() - (24 * 7))).setHours(7, 0, 0, 0),
  steps: {
    days: 1
  }
}, {
  type: 'datepicker',
  name: 'endTime',
  message: 'Select an end time: ',
  format: 'llll',
  default: new Date(),
  steps: {
    days: 1
  }
}, {
  type: 'autocomplete',
  name: 'format',
  message: interactionColor('Please select the format'),
  source: (answersSoFar, input) => Promise.resolve(['csv', 'xlsx'])
}]

async function generateReport (options) {
  const spinner = new Spinner(feedbackColor(`signing in to API`))
  try {
    const { startTime, endTime, format } = (options.startTime && options.endTime && options.format) ? options : await inquirer.prompt(questions)

    spinner.start()
    const token = await signIn()
    spinner.update(feedbackColor(`downloading report`))
    const result = await downloadReport(token, new Date(startTime), new Date(new Date(endTime).setHours(23, 59)), 'Europe/Berlin', format)
    spinner.update(feedbackColor(`saving to file system`))
    const fileName = `${process.cwd()}/${process.env.LOGNAME}_week${getWeek(new Date())}.${format === 'xlsx' ? 'xls' : format}`
    const writeStream = fs.createWriteStream(fileName)
    if (format === 'xlsx') {
      writeStream.write(result)
      writeStream.close()
    } else {
      writeStream.write(result)
      writeStream.close()
    }
    spinner.end()
  } catch (err) {
    spinner.end()
  }
}

const getWeek = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1)
  return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7)
}

module.exports = { generateReport }
