const inquirer = require('inquirer')
const { Spinner } = require('../helpers/spinner')
const { signIn, downloadReport } = require('../helpers/timeular-api-helpers')
const { feedbackColor, interactionColor, errorColor } = require('../helpers/colors')
const fs = require('fs')
async function generateReport (options) {
  const { startTime, endTime, format } = options
  const answers = await inquirer.prompt([{
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
  }])
  console.log(answers)
  const token = await signIn()
  const result = await downloadReport(token, new Date(answers.startTime), new Date(answers.endTime), 'Europe/Berlin', format)

  var writeStream = fs.createWriteStream(`${process.env.LOGNAME}_report.${answers.format === 'xlsx' ? 'xls' : answers.format}`)
  writeStream.write(result)
  writeStream.close()
}
module.exports = { generateReport }
