const apiHelpers = require('../../helpers/timeular-api-helpers')

const apiLogin = require('../../middleware/apiLogin')

jest.mock('../../helpers/timeular-api-helpers')

describe('apiLogin()', () => {
  const token = 'abc12345'
  const argv = {
    foo: 'bar'
  }

  it('calls signIn()', async () => {
    apiHelpers.signIn.mockImplementationOnce(() => Promise.resolve(token))

    await apiLogin(argv)

    expect(apiHelpers.signIn).toHaveBeenCalledTimes(1)
  })

  it('adds apiToken to the other arguments', async () => {
    apiHelpers.signIn.mockImplementationOnce(() => Promise.resolve(token))

    const result = await apiLogin(argv)

    Object.keys(argv).forEach(key => {
      expect(result[key]).toBe(argv[key])
    })
    expect(result.apiToken).toBe(token)
  })

  it('throws error in case for missing credentials', async () => {
    const response = {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Explanation of what has happened' }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    apiHelpers.signIn.mockImplementationOnce(() => Promise.reject({ response }))

    await expect(apiLogin(argv)).rejects.toEqual(new Error('Login to Timeular failed: missing credentials'))
  })

  it('throws error in case for invalid credentials', async () => {
    const response = {
      status: 401,
      statusText: 'Unauthorized',
      data: { message: 'Explanation of what has happened' }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    apiHelpers.signIn.mockImplementationOnce(() => Promise.reject({ response }))

    await expect(apiLogin(argv)).rejects.toEqual(new Error('Login to Timeular failed: invalid credentials'))
  })

  it('throws error in case for internal error', async () => {
    const response = {
      status: 500,
      statusText: 'Internal Server Error',
      data: { message: 'Explanation of what has happened' }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    apiHelpers.signIn.mockImplementationOnce(() => Promise.reject({ response }))

    await expect(apiLogin(argv)).rejects.toEqual(new Error('Login to Timeular failed: unknown error'))
  })

  it('throws error in case of empty response', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    apiHelpers.signIn.mockImplementationOnce(() => Promise.reject({ response: {} }))

    await expect(apiLogin(argv)).rejects.toEqual(new Error('Login to Timeular failed: unknown error'))
  })

  it('rethrows unexpected errors', async () => {
    const err = new Error('something unexpected')
    apiHelpers.signIn.mockImplementationOnce(() => Promise.reject(err))

    await expect(apiLogin(argv)).rejects.toEqual(err)
  })
})
