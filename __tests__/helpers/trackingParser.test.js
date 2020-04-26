const trackingParser = require('../../helpers/trackingParser')

const mockDate = new Date('2019-05-14T11:01:58.135Z')
global.Date = class extends Date {
  constructor (date) {
    // eslint-disable-next-line constructor-super
    return date ? super(date) : mockDate
  }
}

describe('trackingParser()', () => {
  const tracking = {
    activity: {
      id: '123',
      name: 'sleeping',
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

  it('includes activity name at start of output', () => {
    const expectedActivityName = 'sleeping'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedActivityName)
    expect(result.indexOf(expectedActivityName)).toBe(0)
  })

  it('includes text from note in output', () => {
    const expectedText = 'development Working with John on the new project'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedText)
  })

  it('includes duration in output', () => {
    const expectedDuration = '(1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedDuration)
  })

  it('returns full information', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
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

    const expectedResult = 'sleeping - development Working with John on the new project (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips empty text', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:00:00.000',
      note: {
        text: '',
        tags: [],
        mentions: []
      }
    }

    const expectedResult = 'sleeping (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips null text', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:00:00.000',
      note: {
        text: null,
        tags: [],
        mentions: []
      }
    }

    const expectedResult = 'sleeping (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips undefined text', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:00:00.000',
      note: {
        text: undefined,
        tags: [],
        mentions: []
      }
    }

    const expectedResult = 'sleeping (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips missing note', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:00:00.000',
      note: null
    }

    const expectedResult = 'sleeping (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips undefined note', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:00:00.000',
      note: undefined
    }

    const expectedResult = 'sleeping (1h 1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toBe(expectedResult)
  })

  it('skips zero hours in duration', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T11:00:00.000',
      note: {
        text: '',
        tags: [],
        mentions: []
      }
    }

    const expectedDuration = '(1m 58s)'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedDuration)
  })

  it('skips zero hours and zero minutes in duration', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T11:01:00.000',
      note: {
        text: '',
        tags: [],
        mentions: []
      }
    }

    const expectedDuration = '(58s)'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedDuration)
  })

  it('includes zero minutes with non-zero hours in duration', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:01:00.000',
      note: {
        text: '',
        tags: [],
        mentions: []
      }
    }

    const expectedDuration = '(1h 0m 58s)'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedDuration)
  })

  it('omits zero seconds in duration', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T10:01:58.000',
      note: {
        text: '',
        tags: [],
        mentions: []
      }
    }

    const expectedDuration = '(1h 0m)'

    const result = trackingParser(tracking)

    expect(result).toInclude(expectedDuration)
  })

  it('omits duration for very short periods', () => {
    const tracking = {
      activity: {
        id: '123',
        name: 'sleeping',
        color: '#a1b2c3',
        integration: 'zei'
      },
      startedAt: '2019-05-14T11:01:58.000',
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

    const expectedText = 'sleeping - development Working with John on the new project'

    const result = trackingParser(tracking)

    expect(result).toEqual(expectedText)
  })

  it('parses also time entries', () => {
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

    const expectedText = 'sleeping - development Working with John on the new project (32d 1h 1m 1s)'

    const result = trackingParser(timeEntry)

    expect(result).toEqual(expectedText)
  })
})
