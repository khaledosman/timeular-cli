const { stop } = require('../../commands')
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('../../helpers/timeular-api-helpers')

describe('stop command', () => {
  const argv = {
    apiToken: 'token12345'
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

  it('checks current activity tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))

    await stop(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('uses provided token', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))

    await stop(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledWith(argv.apiToken)
  })

  it('stops activity tracking by ID', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))

    await stop(argv)

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.stopTracking).toHaveBeenCalledWith(argv.apiToken, currentTracking.activity.id)
  })

  it('writes tracked activity to the console', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.resolve(timeEntry))

    await stop(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith('Stopped tracking: sleeping - development Working with John on the new project (32d 1h 1m 1s)')
  })

  it('does not attempt to stop tracking if no current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    try {
      await stop(argv)
    } catch (err) {
      expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(0)
      return
    }
    jest.fail()
  })

  it('writes error to the console if no current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await expect(stop(argv)).rejects.toThrow(new Error('No running activity - nothing to stop'))
  })

  it('rejects if something went wrong', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.reject(new Error('something went wrong')))

    await expect(stop(argv)).rejects.toThrow(new Error('something went wrong'))
  })

  it('rejects if error response is returned', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    // eslint-disable-next-line prefer-promise-reject-errors
    apiHelpers.stopTracking.mockImplementationOnce(() => Promise.reject({ response: { data: { message: 'some server error' } } }))

    await expect(stop(argv)).rejects.toHaveProperty('response', { data: { message: 'some server error' } })
  })
})
