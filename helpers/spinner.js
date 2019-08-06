const CLUI = require('clui')

class Spinner {
  constructor (message = 'Exiting in 10 seconds...  ') {
    this.countdown = new CLUI.Spinner(message/*, ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'] */)
  }

  start () {
    this.countdown.start()
  }

  update (message) {
    this.countdown.message(message)
  }

  end () {
    this.countdown.stop()
    process.stdout.write('\n')
  }
}
module.exports.Spinner = Spinner
