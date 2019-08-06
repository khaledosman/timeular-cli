#!/usr/bin/env node
require('dotenv').config()
const program = require('commander')
const figlet = require('figlet')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fuzzy = require('fuzzy')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { Spinner } = require('./helpers/spinner')
const { signIn, getActivities, startTracking, getCurrentTracking, stopTracking } = require('./helpers/timeular-api-helpers')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
const interactionColor = chalk.blue
const feedbackColor = chalk.cyan
const errorColor = chalk.red

initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .command('track [activityName]')
    .description('start tracking for a specific activity')
    // .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action(async (activityName, options) => {
      const spinner = new Spinner(feedbackColor(`logging in to Timeular API`))
      const spinner2 = new Spinner(feedbackColor(`getting current active tracking`))
      try {
        spinner.start()
        const token = await signIn()
        spinner.update(feedbackColor(`getting available activities`))
        const activities = await getActivities(token)
        spinner.end()
        let activityId
        if (!activityName) {
          const answers = await inquirer
            .prompt({
              type: 'autocomplete',
              name: 'activityName',
              message: interactionColor('Please select an activity'),
              source: async (answersSoFar, input) => {
                const labels = activities.map(a => a.name)
                if (!input) {
                  return Promise.resolve(labels)
                } else {
                  const results = fuzzy.filter(input, labels)
                  return Promise.resolve(results.map(({ string, score, index, original }) => labels[index]))
                }
              }
            })
          activityName = answers.activityName
          activityId = activities.find(a => a.name === answers.activityName).id
        } else {
          activityId = activities.find(a => a.name === activityName).id
        }

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
        console.log(feedbackColor(`started tracking ${activityName} ${activityId}`))
      } catch (err) {
        spinner.end()
        spinner2.end()
        console.log(errorColor((err.response && err.response.data) || err))
      }
    })

  console.log(chalk.magenta(figlet.textSync('Timeular', {
    // font: 'Dancing Font',
    horizontalLayout: 'full',
    verticalLayout: 'full'
  })))

  program.parse(process.argv)

  // if no commands/arguments specified, show the help
  if (!process.argv.slice(2).length) {
    program.help()
  }
}
