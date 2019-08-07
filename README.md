# timeular-cli
CLI wrapper for Timeular's API to track activities and generate csv & xlsx reports!

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
MacBook-Pro-3:github khaledosman$ timeular --help
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
  track [activityName]  start tracking for a specific activity
  report [options]      generates timeular report in csv or xlsx format
```

`timeular track --help`

`timeular report --help`
```
MacBook-Pro-3:github khaledosman$ timeular report --help
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

