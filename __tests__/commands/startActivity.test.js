const { startActivity } = require('../../commands/startActivity')
const apiHelpers = require('../../helpers/timeular-api-helpers')
const colors = require('../../helpers/colors')

jest.mock('../../helpers/timeular-api-helpers')

describe('startActivity()', () => {
  const token = 'token12345'

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

  it('writes started activity to the console for new tracking', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await startActivity('sleeping')

    expect(apiHelpers.getActivities).toHaveBeenCalledTimes(1)
    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith(colors.feedbackColor('started tracking activity sleeping with id 123'))
  })

  it('checks available activities', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))

    await startActivity('sleeping')

    expect(apiHelpers.getActivities).toHaveBeenCalledTimes(1)
  })

  it('writes an error to the console if the activity does not exist and exits', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([]))

    await startActivity('sleeping')

    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenLastCalledWith(colors.errorColor('activity not found'))
    expect(process.exit).toHaveBeenCalledWith(1)
  })

  it('checks current activity tracking', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await startActivity('sleeping')

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('stops current tracking and starts new tracking if tracking before', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await startActivity('sleeping')

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.stopTracking).toHaveBeenCalledWith(token, currentTracking.activity.id)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledWith(token, activity.id, undefined)
  })

  it('starts new tracking without stopping if no tracking before', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await startActivity('sleeping')

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(0)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledWith(token, activity.id, undefined)
  })

  it('writes an error and does not start tracking if stopping fails', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([activity]))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))
    apiHelpers.stopTracking.mockRejectedValue({ response: { data: { message: 'something went wrong' } } })

    await startActivity('sleeping')

    expect(apiHelpers.stopTracking).toHaveBeenCalledTimes(1)
    expect(apiHelpers.startTracking).toHaveBeenCalledTimes(0)
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith({ message: 'something went wrong' })
  })
})
