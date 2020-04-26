#!/usr/bin/env node

require('dotenv').config()

const yargs = require('yargs')
const inquirer = require('inquirer')
const { startActivity, stopActivity, status, listActivities } = require('./commands')
const { getCLIVersion } = require('./helpers/get-cli-version')
const apiLogin = require('./middleware/apiLogin')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('datepicker', require('inquirer-datepicker'))

const init = async () => {
  // eslint-disable-next-line no-unused-expressions
  yargs
    .scriptName('timeular')
    .usage('Usage: $0 <command> [options]')
    .command({
      command: 'track [activityName]',
      aliases: [],
      desc: 'Start tracking for a specific activity, stops current tracking before starting a new one',
      builder: yargs => {
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
      },
      handler: async argv => { await startActivity(argv.activityName, argv.message) }
    })
    .command({
      command: 'stop',
      aliases: [],
      desc: 'Stops tracking current activity',
      handler: async argv => { await stopActivity() }
    })
    .command('status', 'Shows the current activity tracking status', () => {}, status, [apiLogin])
    .command('list', 'Lists all activities that are available for tracking', () => {}, listActivities, [apiLogin])
    .help('help', 'output usage information')
    .alias(['h'], 'help')
    .showHelpOnFail(true)
    .version('version', 'output the version number', getCLIVersion())
    .alias(['v'], 'version')
    .recommendCommands()
    .wrap(100)
    .strict(true)
    .demandCommand(1, '')
    .middleware(apiLogin)
    .fail((msg, err) => {
      console.log(msg || err.message)
      process.exit(1)
    })
    .argv
}

init()
