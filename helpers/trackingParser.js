const parse = tracking => {
  const { activity, note = {}, startedAt } = tracking
  const { hours, minutes, seconds } = _duration(startedAt + 'Z', new Date().toUTCString())

  let output = activity.name
  output += note && note.text ? ' - ' + note.text : ''
  output += ' (' + hours + minutes + seconds + ')'

  return output
}

const _duration = (startedAt, now) => {
  let distance = Math.abs(new Date(startedAt) - new Date(now))

  const hours = Math.floor(distance / 3600000)
  distance -= hours * 3600000
  const minutes = Math.floor(distance / 60000)
  distance -= minutes * 60000
  const seconds = Math.floor(distance / 1000)

  return {
    hours: hours > 0 ? `${hours}h ` : '',
    minutes: minutes > 0 || hours > 0 ? `${minutes}m ` : '',
    seconds: seconds > 0 ? `${seconds}s` : ''
  }
}

module.exports = parse
