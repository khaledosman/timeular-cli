[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub version](https://badge.fury.io/gh/andreassiegel%2Ftimeular-cli.svg)](https://badge.fury.io/gh/andreassiegel%2Ftimeular-cli)

[![Build Status](https://travis-ci.com/andreassiegel/timeular-cli.svg?branch=master)](https://travis-ci.com/andreassiegel/timeular-cli)
[![codebeat badge](https://codebeat.co/badges/f9ce0d07-2a62-43b1-bbd8-17f02bc1bb86)](https://codebeat.co/projects/github-com-andreassiegel-timeular-cli-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/d5b0f6f7ba3b53e7baa2/maintainability)](https://codeclimate.com/github/andreassiegel/timeular-cli/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/andreassiegel/timeular-cli/badge.svg)](https://snyk.io/test/github/andreassiegel/timeular-cli)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d5b0f6f7ba3b53e7baa2/test_coverage)](https://codeclimate.com/github/andreassiegel/timeular-cli/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/andreassiegel/timeular-cli/badge.svg?branch=master)](https://coveralls.io/github/andreassiegel/timeular-cli?branch=master)
[![dependencies Status](https://david-dm.org/andreassiegel/timeular-cli/status.svg)](https://david-dm.org/andreassiegel/timeular-cli)
[![devDependencies Status](https://david-dm.org/andreassiegel/timeular-cli/dev-status.svg)](https://david-dm.org/andreassiegel/timeular-cli?type=dev)

# Timeular CLI

Command-line integration for [Timeular](https://timeular.com/) to track activities and check the status of the currently tracked activity.

It can be used as an interactive CLI by asking the user questions or directly by setting the required input via the corresponding flags.

The current version does not require a Timeular Pro account.
It uses only API features that are available in the free version.

## Installation

*While refactoring is ongoing and new features are being added, the application is not published to any registry yet.*

Therefore, you need to check out the repository before you can actually install it:

```shell script
$ git clone https://github.com/andreassiegel/timeular-cli.git
$ cd timeular-cli
$ npm install -g 
```

## Configuration

Timeular CLI is using the public Timeular API that requires authentication via your personal API key.

You can get your API credentials from the [Timeular account page](https://profile.timeular.com/#/app/account).

To be able to use Timeular CLI, you have to export the API credentials as environment variables,
e.g., in your `.profile` or `.bashrc` or `.zshrc` file:

```shell script
export TIMEULAR_API_KEY="XXXXXXXXXX"
export TIMEULAR_API_SECRET="YYYYYYYYYY"
```

## Usage

```
$ timeular --help
Usage: timeular <command> [options]

Commands:
  timeular start [activityName]  Start tracking for a specific activity, stops current tracking
                                 before starting a new one
  timeular stop                  Stops tracking current activity
  timeular status                Shows the current activity tracking status
  timeular list                  Lists all activities that are available for tracking

Options:
  -h, --help     output usage information                                                  [boolean]
  -v, --version  output the version number                                                 [boolean]
```

### Tracking Activity

Activities can be tracked in multiple ways:

#### Interactive Tracking

If you do not provide any options to the `start` command, you will be prompted to select the activity to track:

```
$ timeular start
0	Administration
1	ARC
2	DEV
3	Education
✔ Number of activity to track: · 0
✔ Note: · Prepare release
Stopped tracking: DEV - Working on Timeular CLI (1h 28m 11s)
Started tracking: Administration - Prepare release
```

The list includes all activities you configured in Timeular.

#### Tracking of a specified Activity

You can directly specify the activity in order to start tracking without selecting from the list:

```shell script
$ timeular track <activity>
```

Nevertheless, you will be prompted for a note.

#### Tracking of a specified Activity with a Note

In addition, you can also add a note when you can directly specify the activity and start tracking immediately:

```shell script
$ timeular track <activity> -m <note>
```

The note may contain tags (`#tag`) and mentions (`@mention`).

### Check the Tracking Status

Use the `status` command to check your current tracking status:

```
$ timeular status
Currently tracking: DEV - Working on Timeular CLI (1h 16m 2s)
```

The output includes the note of the current tracking, if available.
The current duration is displayed as well.

### Stop Tracking

To finish an activity, use the `stop` command:

```
$ timeular stop
Stopped tracking: DEV (4h 24m 51s)
```

### List Activities

You can use the `list` command to print all activities that are available for tracking.
The output is indexed and sorted alphabetically.

If the tracker is running, the currently tracked is highlighted.

```
$ timeular list
0	Administration
1	ARC
2	DEV  
3	Education
```
