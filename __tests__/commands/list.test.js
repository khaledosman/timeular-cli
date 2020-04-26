const chalk = require('chalk')
const { list } = require('../../commands')
const apiHelpers = require('../../helpers/timeular-api-helpers')

jest.mock('../../helpers/timeular-api-helpers')

describe('list command', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(global.console, 'log'),
      warn: jest.spyOn(global.console, 'warn'),
      error: jest.spyOn(global.console, 'error')
    }
  })

  afterEach(() => {
    Object.keys(consoleSpy).forEach(key => {
      consoleSpy[key].mockRestore()
    })
    jest.clearAllMocks()
  })

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

  const activities = [
    {
      id: '123',
      name: 'sleeping',
      color: '#a1b2c3',
      integration: 'zei',
      deviceSide: null
    },
    {
      id: '456',
      name: 'sitting',
      color: '#a1b2c3',
      integration: 'zei',
      deviceSide: null
    },
    {
      id: '789',
      name: 'waiting',
      color: '#a1b2c3',
      integration: 'zei',
      deviceSide: null
    },
    {
      id: '101112',
      name: 'eating',
      color: '#a1b2c3',
      integration: 'zei',
      deviceSide: null
    },
    {
      id: '131415',
      name: 'wishing',
      color: '#a1b2c3',
      integration: 'zei',
      deviceSide: null
    }
  ]

  it('fetches activities', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([]))

    await list(argv)

    expect(apiHelpers.getActivities).toHaveBeenCalledTimes(1)
  })

  it('uses provided token to fetch activities', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve([]))

    await list(argv)

    expect(apiHelpers.getActivities).toHaveBeenCalledWith(argv.apiToken)
  })

  it('checks current activity tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve({}))

    await list(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledTimes(1)
  })

  it('uses provided token to check current tracking', async () => {
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve({}))

    await list(argv)

    expect(apiHelpers.getCurrentTracking).toHaveBeenCalledWith(argv.apiToken)
  })

  it('orders alphabetically and outputs with index', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve(activities))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve({}))

    await list(argv)

    expect(console.log).toHaveBeenCalledTimes(5)
    expect(console.log).toHaveBeenNthCalledWith(1, '0\teating')
    expect(console.log).toHaveBeenNthCalledWith(2, '1\tsitting')
    expect(console.log).toHaveBeenNthCalledWith(3, '2\tsleeping')
    expect(console.log).toHaveBeenNthCalledWith(4, '3\twaiting')
    expect(console.log).toHaveBeenNthCalledWith(5, '4\twishing')
  })

  it('prints currently tracked activity in bold and clock icon', async () => {
    apiHelpers.getActivities.mockImplementationOnce(() => Promise.resolve(activities))
    apiHelpers.getCurrentTracking.mockImplementationOnce(() => Promise.resolve(currentTracking))

    await list(argv)

    expect(console.log).toHaveBeenCalledWith(`0\t${chalk.bold('eating \uF017')}`)
  })

  it('writes an error if getting activities fails', async () => {
    apiHelpers.getActivities.mockRejectedValue({ response: { data: { message: 'something went wrong' } } })

    await list(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith({ message: 'something went wrong' })
  })

  it('writes an error if current tracking check fails', async () => {
    apiHelpers.getCurrentTracking.mockRejectedValue({ response: { data: { message: 'something went wrong' } } })

    await list(argv)

    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenLastCalledWith({ message: 'something went wrong' })
  })
})
