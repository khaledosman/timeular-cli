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

# timeular-cli
CLI wrapper for Timeular's API to track activities and generate csv & xlsx reports!
Can be used as an interactive cli by asking the user questions or directly by setting the required input via their corresponding flags

# Installation

`npm i -g timeular-cli`


Update your .profile or .bashrc or .zshrc to include the following environment variables:

```
export TIMEULAR_API_KEY="XXXXXXXXXX"
export TIMEULAR_API_SECRET="YYYYYYYYYY"
```

You can get the values for these fields by visiting your [Account page](https://profile.timeular.com/#/app/account) on Timeular

# Usage
`timeular --help`
```
➜  github timeular --help
  _____   _                              _
 |_   _| (_)  _ __ ___     ___   _   _  | |   __ _   _ __
   | |   | | | '_ ` _ \   / _ \ | | | | | |  / _` | | '__|
   | |   | | | | | | | | |  __/ | |_| | | | | (_| | | |
   |_|   |_| |_| |_| |_|  \___|  \__,_| |_|  \__,_| |_|

Usage: timeular [options] [command]

Options:
  -v, --version         output the version number
  -h, --help            output usage information

Commands:
  track [activityName]  start tracking for a specific activity, stops current tracking before starting a new one
  report [options]      generates timeular report in csv or xlsx format
  stop                  stops tracking current activity
```

`timeular track --help`

`timeular report --help`
```
MacBook-Pro-3:github andreassiegel$ timeular report --help
  _____   _                              _
 |_   _| (_)  _ __ ___     ___   _   _  | |   __ _   _ __
   | |   | | | '_ ` _ \   / _ \ | | | | | |  / _` | | '__|
   | |   | | | | | | | | |  __/ | |_| | | | | (_| | | |
   |_|   |_| |_| |_| |_|  \___|  \__,_| |_|  \__,_| |_|

Usage: report [options]

generates timeular report in csv or xlsx format

Options:
  -s, --startTime <startTime>  startTime
  -e, --endTime <endTIme>      endTime
  -f, --format <format>        xlsx or csv
  -h, --help                   output usage information
```

## Track Activity
- `timeular track <activityName>`  or
- `timeular track`

## Generate A Report
- `timeular report -s <startTime> -e <endTime> -f <format>` or
- `timeular report`

