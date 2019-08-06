const inquirer = require('inquirer')
const { Spinner } = require('../helpers/spinner')
const { signIn, downloadReport } = require('../helpers/timeular-api-helpers')
const { feedbackColor, interactionColor, errorColor } = require('../helpers/colors')
const Excel = require('exceljs')
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
  const spinner = new Spinner(feedbackColor(`signing in to API`))
  spinner.start()
  const token = await signIn()
  spinner.update(feedbackColor(`downloading report`))
  const result = await downloadReport(token, new Date(answers.startTime), new Date(answers.endTime), 'Europe/Berlin', answers.format)
  console.log(result)
  spinner.update(feedbackColor(`saving to file system`))
  const writeStream = fs.createWriteStream(`${process.env.LOGNAME}_week${getWeek(new Date())}.${answers.format}`)
  if (answers.format === 'xlsx') {
    // const workbook = new Excel.Workbook()
    // await workbook.xlsx.write(result, {

    // }))
    writeStream.write(result)
  } else {
    writeStream.write(result)
  }
  writeStream.close()
  spinner.end()
}

const getWeek = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1)
  return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7)
}

module.exports = { generateReport }
