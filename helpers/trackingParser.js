const parse = tracking => {
  const { activity, note = {}, startedAt, duration: givenDuration } = tracking
  const duration = givenDuration
    ? _duration(_fixTimeularTimestamp(givenDuration.startedAt), _fixTimeularTimestamp(givenDuration.stoppedAt))
    : _duration(_fixTimeularTimestamp(startedAt), new Date().toUTCString())

  let output = activity.name
  output += note && note.text ? ' - ' + note.text : ''
  if (duration.length > 0) {
    output += ' (' + duration.join(' ') + ')'
  }

  return output
}

const _fixTimeularTimestamp = timestamp => timestamp + 'Z'

const _duration = (startedAt, now) => {
  let distance = Math.abs(new Date(startedAt) - new Date(now))

  let hours = Math.floor(distance / 3600000)
  const days = Math.floor(hours / 24)
  distance -= hours * 3600000
  hours -= days * 24
  const minutes = Math.floor(distance / 60000)
  distance -= minutes * 60000
  const seconds = Math.floor(distance / 1000)

  return [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours}h` : '',
    minutes > 0 || hours > 0 ? `${minutes}m` : '',
    seconds > 0 ? `${seconds}s` : ''
  ].filter(e => e !== '')
}

module.exports = parse
