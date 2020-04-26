const { status } = require('../../commands')
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('../../helpers/timeular-api-helpers')

const mockDate = new Date('2019-05-14T11:01:58.135Z')
global.Date = class extends Date {
  constructor (date) {
    // eslint-disable-next-line constructor-super
    return date ? super(date) : mockDate
  }
}

describe('status()', () => {
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
    startedAt: '2019-05-14T10:00:00.000',
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

    await status(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('uses provided token', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await status(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledWith(argv.apiToken)
  })

  it('writes to console if no current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(null))

    await status(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith('Currently not tracking any activity')
  })

  it('writes current tracking to console', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await status(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith('Currently tracking: eating - development Working with John on the new project (1h 1m 58s)')
  })

  it('writes an error if current tracking check fails', async () => {
    apiHelpers.getCurrentTracking.mockRejectedValue({ response: { data: { message: 'something went wrong' } } })

    await status(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith('something went wrong')
  })

  it('writes an error if current tracking check throws an error', async () => {
    apiHelpers.getCurrentTracking.mockRejectedValue(new Error('something went wrong'))

    await status(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith(new Error('something went wrong'))
  })
})
