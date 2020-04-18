#!/usr/bin/env node

require('dotenv').config()
const program = require('commander')
const inquirer = require('inquirer')
const { startActivity } = require('./commands/startActivity')
const { generateReport } = require('./commands/generateReport')
const { getCLIVersion } = require('./helpers/get-cli-version')
const { stopActivity } = require('./commands/stopActivity.js')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('datepicker', require('inquirer-datepicker'))

initCli()

async function initCli () {
  const version = await getCLIVersion()

  program
    .version(version, '-v, --version')

  program
    .command('track [activityName]')
    .description('start tracking for a specific activity, stops current tracking before starting a new one')
    // .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action(async (activityName, options) => {
      await startActivity(activityName, options)
    })

  program
    .command('report')
    .description('generates timeular report in csv or xlsx format')
    .option('-s, --startTime <startTime>', 'startTime')
    .option('-e, --endTime <endTime>', 'endTime')
    .option('-f, --format <format>', 'xlsx or csv')
    .action(async options => {
      await generateReport(options)
    })

  program
    .command('stop')
    .description('stops tracking current activity')
    .action(async (activityName, options) => {
      await stopActivity(activityName, options)
    })

  program.parse(process.argv)

  // if no commands/arguments specified, show the help
  if (!process.argv.slice(2).length) {
    program.help()
  }
}
