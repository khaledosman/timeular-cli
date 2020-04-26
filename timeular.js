#!/usr/bin/env node

require('dotenv').config()

const yargs = require('yargs')
const inquirer = require('inquirer')
const { start, stop, status, list } = require('./commands')
const { getCLIVersion } = require('./helpers/get-cli-version')
const apiLogin = require('./middleware/apiLogin')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('datepicker', require('inquirer-datepicker'))

const init = async () => {
  // eslint-disable-next-line no-unused-expressions
  yargs
    .scriptName('timeular')
    .usage('Usage: $0 <command> [options]')
    .command('start [activityName]', 'Start tracking for a specific activity, stops current tracking before starting a new one', yargs => {
      yargs
        .positional('activityName', {
          type: 'string',
          default: '',
          describe: 'the name of the activity to track'
        })
        .option('m', {
          alias: 'message',
          describe: 'the message to add to the activity',
          type: 'string',
          nargs: 1,
          demand: false
        })
    }, start, [apiLogin])
    .command('stop', 'Stops tracking current activity', () => {}, stop, [apiLogin])
    .command('status', 'Shows the current activity tracking status', () => {}, status, [apiLogin])
    .command('list', 'Lists all activities that are available for tracking', () => {}, list, [apiLogin])
    .help('help', 'output usage information')
    .alias(['h'], 'help')
    .version('version', 'output the version number', getCLIVersion())
    .alias(['v'], 'version')
    .recommendCommands()
    .wrap(100)
    .strict(true)
    .demandCommand(1, '')
    .middleware(apiLogin)
    .fail(_errorHandler)
    .argv
}

const _errorHandler = (msg, err, yargs) => {
  if (!err && !msg) {
    yargs.showHelp()
  } else {
    console.log(msg || (err && err.message) || err)
  }
  process.exit(1)
}

init()
