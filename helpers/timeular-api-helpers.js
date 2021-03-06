const axios = require('axios')
const TIMEULAR_API_KEY = process.env.TIMEULAR_API_KEY
const TIMEULAR_API_SECRET = process.env.TIMEULAR_API_SECRET
const TIMEULAR_API_URL = 'https://api.timeular.com/api/v2'

const cache = {}
const createAPIHeaders = token => ({
  Authorization: `Bearer ${token}`
})

async function signIn () {
  const { data: { token } } = await axios.post(`${TIMEULAR_API_URL}/developer/sign-in`, {
    apiKey: TIMEULAR_API_KEY,
    apiSecret: TIMEULAR_API_SECRET
  })
  cache.token = token
  return token
}

async function getActivities (token) {
  const { data: { activities } } = await axios.get(`${TIMEULAR_API_URL}/activities`, {
    headers: createAPIHeaders(token)
  })
  return activities
}

async function startTracking (token, activityId) {
  const { data } = await axios.post(`${TIMEULAR_API_URL}/tracking/${activityId}/start`, { startedAt: _convertToAPICompatibleDate(new Date()) }, {
    headers: createAPIHeaders(token)
  })
  return data
}

async function getCurrentTracking (token) {
  const { data: { currentTracking } } = await axios.get(`${TIMEULAR_API_URL}/tracking`, {
    headers: createAPIHeaders(token)
  })
  return currentTracking
}

async function stopTracking (token, activityId) {
  const { data: { createdTimeEntry } } = await axios.post(`${TIMEULAR_API_URL}/tracking/${activityId}/stop`, { stoppedAt: _convertToAPICompatibleDate(new Date()) }, {
    headers: createAPIHeaders(token)
  })
  return createdTimeEntry
}

async function downloadReport (token, { startTimestamp, stopTimestamp, timezone = 'Europe/Berlin', fileType = 'csv' }) {
  startTimestamp = _convertToAPICompatibleDate(startTimestamp)
  stopTimestamp = _convertToAPICompatibleDate(stopTimestamp)
  const { data } = await axios.get(`${TIMEULAR_API_URL}/report/${startTimestamp}/${stopTimestamp}?timezone=${encodeURIComponent(timezone)}&fileType=${fileType}`, {
    headers: createAPIHeaders(token),
    responseType: 'arraybuffer'
  })
  return data
}

function _convertToAPICompatibleDate (date) {
  const dateString = date.toISOString()
  const dateWithoutLastChar = dateString.slice(0, dateString.length - 1)
  return dateWithoutLastChar
}
module.exports = { signIn, getActivities, startTracking, getCurrentTracking, stopTracking, downloadReport }

// (async () => {
//   const token = await signIn()
//   const activities = await getActivities(token)
//   console.log(activities)
// })()
