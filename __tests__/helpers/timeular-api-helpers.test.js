const axios = require('axios')
const { TIMEULAR_API_KEY, TIMEULAR_API_SECRET } = process.env
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('axios')

const mockDate = new Date('2019-05-14T11:01:58.135Z')
global.Date = class extends Date {
  constructor (date) {
    // eslint-disable-next-line constructor-super
    return date ? super(date) : mockDate
  }
}

describe('Timeular API Helpers', () => {
  const TIMEULAR_API_URL = 'https://api.timeular.com/api/v2'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signIn()', () => {
    const token = '12345'
    const response = { status: 200, statusText: 'OK', data: { token } }

    it('sends request with API credentials', async () => {
      const apiKey = TIMEULAR_API_KEY
      const apiSecret = TIMEULAR_API_SECRET
      const expectedBody = { apiKey, apiSecret }

      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await apiHelpers.signIn()

      expect(axios.post).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/developer/sign-in`, expectedBody)
    })

    it('returns token', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.signIn()).resolves.toEqual(token)
    })

    it('returns undefined for 400 Bad Request', async () => {
      const response = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.signIn()).resolves.toBeUndefined()
    })

    it('returns undefined for 401 Unauthorized', async () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.signIn()).resolves.toBeUndefined()
    })
  })

  describe('getActivities()', () => {
    const token = '12345'
    const response = {
      status: 200,
      statusText: 'OK',
      data: {
        activities: [
          {
            id: '123',
            name: 'sleeping',
            color: '#a1b2c3',
            integration: 'zei',
            deviceSide: null
          }
        ]
      }
    }

    it('sends request with token', async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(response))
      const expectedHeaders = { Authorization: `Bearer ${token}` }

      await apiHelpers.getActivities(token)

      expect(axios.get).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/activities`, { headers: expectedHeaders })
    })

    it('returns activities data', async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.getActivities(token)).resolves.toEqual(response.data.activities)
    })

    it('returns undefined for 401 Unauthorized', async () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Explanation of what has happened' }
      }
      axios.get.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.getActivities(undefined)).resolves.toBeUndefined()
    })
  })

  describe('startTracking()', () => {
    const token = '12345'
    const activityId = '123'
    const note = '#development Working with @John on the new project'
    const response = {
      status: 200,
      statusText: 'OK',
      data: {
        startedAt: '2017-01-02T03:04:05.678',
        note: {
          text: 'development Working with John on the new project',
          tags: [
            {
              indices: [
                0,
                11
              ],
              key: 'development'
            }
          ],
          mentions: [
            {
              indices: [
                25,
                29
              ],
              key: 'John'
            }
          ]
        }
      }
    }

    it('sends request with token', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))
      const expectedHeaders = { Authorization: `Bearer ${token}` }
      const expectedBody = { startedAt: '2019-05-14T11:01:58.135' }

      await apiHelpers.startTracking(token, activityId)

      expect(axios.post).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/tracking/${activityId}/start`, expectedBody, { headers: expectedHeaders })
    })

    it('sends request with note', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))
      const expectedHeaders = { Authorization: `Bearer ${token}` }
      const expectedBody = {
        startedAt: '2019-05-14T11:01:58.135',
        note: {
          text: 'development Working with John on the new project',
          tags: [
            {
              indices: [
                0,
                11
              ],
              key: 'development'
            }
          ],
          mentions: [
            {
              indices: [
                25,
                29
              ],
              key: 'John'
            }
          ]
        }
      }

      await apiHelpers.startTracking(token, activityId, note)

      expect(axios.post).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/tracking/${activityId}/start`, expectedBody, { headers: expectedHeaders })
    })

    it('returns current tracking data', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.startTracking(token, activityId)).resolves.toEqual(response.data)
    })

    it('returns error message for 400 Bad Request', async () => {
      const response = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.startTracking(token, activityId)).resolves.toEqual(response.data)
    })

    it('returns error message for 401 Unauthorized', async () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.startTracking(undefined, activityId)).resolves.toEqual(response.data)
    })
  })

  describe('getCurrentTracking()', () => {
    const token = '12345'
    const response = {
      status: 200,
      statusText: 'OK',
      data: {
        currentTracking: {
          activity: {
            id: '123',
            name: 'sleeping',
            color: '#a1b2c3',
            integration: 'zei'
          },
          startedAt: '2017-01-02T03:04:05.678',
          note: {
            text: 'development Working with John on the new project',
            tags: [
              {
                indices: [
                  0,
                  11
                ],
                key: 'development'
              }
            ],
            mentions: [
              {
                indices: [
                  25,
                  29
                ],
                key: 'John'
              }
            ]
          }
        }
      }
    }

    it('sends request with token', async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(response))
      const expectedHeaders = { Authorization: `Bearer ${token}` }

      await apiHelpers.getCurrentTracking(token)

      expect(axios.get).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/tracking`, { headers: expectedHeaders })
    })

    it('returns tracking data', async () => {
      axios.get.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.getCurrentTracking(token)).resolves.toEqual(response.data.currentTracking)
    })

    it('returns null when nothing is tracked', async () => {
      const response = {
        status: 200,
        statusText: 'OK',
        data: {
          currentTracking: null
        }
      }
      axios.get.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.getCurrentTracking(token)).resolves.toBeNull()
    })

    it('returns undefined for 401 Unauthorized', async () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Explanation of what has happened' }
      }
      axios.get.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.getCurrentTracking(undefined)).resolves.toBeUndefined()
    })
  })

  describe('stopTracking()', () => {
    const token = '12345'
    const activityId = '123'
    const response = {
      status: 200,
      statusText: 'OK',
      data: {
        createdTimeEntry: {
          id: '987',
          activity: {
            id: '123',
            name: 'sleeping',
            color: '#a1b2c3',
            integration: 'zei'
          },
          duration: {
            startedAt: '2017-01-02T03:04:05.678',
            stoppedAt: '2017-02-03T04:05:06.789'
          },
          note: {
            text: 'development Working with John on the new project',
            tags: [
              {
                indices: [
                  0,
                  11
                ],
                key: 'development'
              }
            ],
            mentions: [
              {
                indices: [
                  25,
                  29
                ],
                key: 'John'
              }
            ]
          }
        }
      }
    }

    it('sends request with token', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))
      const expectedHeaders = { Authorization: `Bearer ${token}` }
      const expectedBody = { stoppedAt: '2019-05-14T11:01:58.135' }

      await apiHelpers.stopTracking(token, activityId)

      expect(axios.post).toHaveBeenCalledWith(`${TIMEULAR_API_URL}/tracking/${activityId}/stop`, expectedBody, { headers: expectedHeaders })
    })

    it('returns created time entry data', async () => {
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.stopTracking(token, activityId)).resolves.toEqual(response.data.createdTimeEntry)
    })

    it('returns undefined for 400 Bad Request', async () => {
      const response = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.stopTracking(token, activityId)).resolves.toBeUndefined()
    })

    it('returns undefined for 401 Unauthorized', async () => {
      const response = {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Explanation of what has happened' }
      }
      axios.post.mockImplementationOnce(() => Promise.resolve(response))

      await expect(apiHelpers.stopTracking(undefined, activityId)).resolves.toBeUndefined()
    })
  })

  describe('parseNote()', () => {
    it('returns undefined for undefined input', () => {
      const msg = undefined

      const result = apiHelpers.parseNote(msg)
      expect(result).toBeUndefined()
    })

    it('returns undefined for null input', () => {
      const msg = null

      const result = apiHelpers.parseNote(msg)
      expect(result).toBeUndefined()
    })

    it('returns undefined for empty input', () => {
      const msg = ''

      const result = apiHelpers.parseNote(msg)
      expect(result).toBeUndefined()
    })

    it('returns note as text without tags or mentions', () => {
      const msg = 'this is my note'
      const expectedNote = {
        text: msg,
        tags: [],
        mentions: []
      }

      const result = apiHelpers.parseNote(msg)
      expect(result).toEqual(expectedNote)
    })

    it('converts tag to object', () => {
      const msg = '#tag'
      const expectedNote = {
        text: 'tag',
        tags: [
          { indices: [0, 3], key: 'tag' }
        ],
        mentions: []
      }

      const result = apiHelpers.parseNote(msg)
      expect(result).toEqual(expectedNote)
    })

    it('converts multiple tags to objects', () => {
      const msg = '#tag something else #foo #bar'
      const expectedNote = {
        text: 'tag something else foo bar',
        tags: [
          { indices: [0, 3], key: 'tag' },
          { indices: [19, 22], key: 'foo' },
          { indices: [23, 26], key: 'bar' }
        ],
        mentions: []
      }

      const result = apiHelpers.parseNote(msg)
      expect(result).toEqual(expectedNote)
    })

    it('ignores # within words', () => {
      const text = 'no#tag'
      const expectedNote = {
        text,
        tags: [],
        mentions: []
      }

      const result = apiHelpers.parseNote(text)
      expect(result).toEqual(expectedNote)
    })

    it('converts mention to object', () => {
      const msg = '@mention'
      const expectedNote = {
        text: 'mention',
        tags: [],
        mentions: [
          { indices: [0, 7], key: 'mention' }
        ]
      }

      const result = apiHelpers.parseNote(msg)
      expect(result).toEqual(expectedNote)
    })

    it('converts multiple mentions to objects', () => {
      const msg = '@mention something else @foo @bar'
      const expectedNote = {
        text: 'mention something else foo bar',
        tags: [],
        mentions: [
          { indices: [0, 7], key: 'mention' },
          { indices: [23, 26], key: 'foo' },
          { indices: [27, 30], key: 'bar' }
        ]
      }

      const result = apiHelpers.parseNote(msg)
      expect(result).toEqual(expectedNote)
    })

    it('ignores @ within words', () => {
      const text = 'no@mention'
      const expectedNote = {
        text,
        tags: [],
        mentions: []
      }

      const result = apiHelpers.parseNote(text)
      expect(result).toEqual(expectedNote)
    })

    it('converts example from API spec', () => {
      const text = '#development Working with @John on the new project'
      const expectedNote = {
        text: 'development Working with John on the new project',
        tags: [
          {
            indices: [
              0,
              11
            ],
            key: 'development'
          }
        ],
        mentions: [
          {
            indices: [
              25,
              29
            ],
            key: 'John'
          }
        ]
      }

      const result = apiHelpers.parseNote(text)
      expect(result).toEqual(expectedNote)
    })

    it('converts multiple occurrences', () => {
      const text = 'Test with #tag and @mention #anothertag'
      const expectedNote = {
        text: 'Test with tag and mention anothertag',
        tags: [
          {
            indices: [
              10,
              13
            ],
            key: 'tag'
          },
          {
            indices: [
              26,
              36
            ],
            key: 'anothertag'
          }
        ],
        mentions: [
          {
            indices: [
              18,
              25
            ],
            key: 'mention'
          }
        ]
      }

      const result = apiHelpers.parseNote(text)
      expect(result).toEqual(expectedNote)
    })
  })
})
