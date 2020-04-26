const { start } = require('../../commands')
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('../../helpers/timeular-api-helpers')

describe('start command', () => {
  const argv = {
    apiToken: 'token12345'
  }

  const activity = {
    id: '123',
    name: 'sleeping',
    color: '#a1b2c3',
    integration: 'zei',
    deviceSide: null
  }
  const currentTracking = {
    activity: {
      id: '456',
      name: 'eating',
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

  const timeEntry = {
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

  const newTracking = {
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

  let consoleSpy
  let exitSpy

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(global.console, 'log'),
      warn: jest.spyOn(global.console, 'warn'),
      error: jest.spyOn(global.console, 'error')
    }
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
  })

  afterEach(() => {
    Object.keys(consoleSpy).forEach(key => {
      consoleSpy[key].mockRestore()
    })
    exitSpy.mockRestore()
    jest.clearAllMocks()
  })

  it('writes started activity to the console for new tracking', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))
    const now = new Date()
    const startedAt = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDay()}T${now.getHours()}:${now.getUTCMinutes()}:${now.getUTCSeconds()}.${now.getUTCMilliseconds()}`
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve({ ...newTracking, startedAt }))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await start(argv)

    expect(apiHelpers.getActivities).toHaveBeenCalledTimes(1)
    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
    // expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith('Started tracking: sleeping - development Working with John on the new project')
  })

  it('checks available activities', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve(newTracking))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await start(argv)

    expect(apiHelpers.getActivities).toHaveBeenCalledTimes(1)
  })

  it('rejects if the activity does not exist and exits', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([]))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await expect(start(argv)).rejects.toThrow(new Error('Activity not found'))
  })

  it('checks current activity tracking', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve(newTracking))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await start(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('stops current tracking and starts new tracking if tracking before', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve(newTracking))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await start(argv)

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.stopTracking).toHaveBeenCalledWith(argv.apiToken, currentTracking.activity.id)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledWith(argv.apiToken, activity.id, argv.message)
  })

  it('starts new tracking without stopping if no tracking before', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve(newTracking))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    await start(argv)

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(0)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledWith(argv.apiToken, activity.id, argv.message)
  })

  it('writes an error and does not start tracking if stopping fails', async () => {
    const response = { response: { data: { message: 'something went wrong' } } }
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockRejectedValue(response)
    apiHelpers.startTracking.mockImplementationOnce(() => Promise.resolve(newTracking))
    argv.activityName = 'sleeping'
    argv.message = 'test'

    try {
      await start(argv)
    } catch (err) {
      expect(err).toEqual(response)
    }

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(0)
  })
})
