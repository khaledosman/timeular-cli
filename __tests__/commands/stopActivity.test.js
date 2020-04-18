const { stopActivity } = require('../../commands/stopActivity')
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('../../helpers/timeular-api-helpers')

describe('stopActivity()', () => {
  const token = 'token12345'

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

  apiHelpers.signIn.mockImplementation(() => Promise.resolve(token))

  it('checks current activity tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await stopActivity('sleeping')

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('stops activity tracking by ID', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await stopActivity('sleeping')

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.stopTracking).toHaveBeenCalledWith(token, currentTracking.activity.id)
  })

  it('does not attempt to stop tracking if no current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await stopActivity('sleeping')

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(0)
  })

  it('writes error to the console if no current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await stopActivity('sleeping')

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith(new Error('found no running activities to stop'))
  })
})
