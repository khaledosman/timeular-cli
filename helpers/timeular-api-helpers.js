const axios = require('axios')
const TIMEULAR_API_KEY = process.env.TIMEULAR_API_KEY
const TIMEULAR_API_SECRET = process.env.TIMEULAR_API_SECRET
const TIMEULAR_API_URL = 'https://api.timeular.com/api/v2'

const cache = {}
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
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return activities
}

async function startTracking (token, activityId) {
  const dateString = new Date().toISOString()
  const dateWithoutLastChar = dateString.slice(0, dateString.length - 1)
  const { data } = await axios.post(`${TIMEULAR_API_URL}/tracking/${activityId}/start`, { startedAt: dateWithoutLastChar }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

async function getCurrentTracking (token) {
  const { data: { currentTracking } } = await axios.get(`${TIMEULAR_API_URL}/tracking`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return currentTracking
}

async function stopTracking (token, activityId) {
  const dateString = new Date().toISOString()
  const dateWithoutLastChar = dateString.slice(0, dateString.length - 1)
  const { data: { createdTimeEntry } } = await axios.post(`${TIMEULAR_API_URL}/tracking/${activityId}/stop`, { stoppedAt: dateWithoutLastChar }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return createdTimeEntry
}

module.exports = { signIn, getActivities, startTracking, getCurrentTracking, stopTracking }

// (async () => {
//   const token = await signIn()
//   const activities = await getActivities(token)
//   console.log(activities)
// })()
