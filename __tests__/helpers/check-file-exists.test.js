const { checkFileExists } = require('../../helpers/check-file-exists')

describe('checkFileExists()', () => {
  it('returns true if file exists', async () => {
    const file = `${__dirname}/test.txt`
    await expect(checkFileExists(file)).resolves.toBeTruthy()
  })

  it('returns false if file exists', async () => {
    const file = `${__dirname}/unknown.txt`
    await expect(checkFileExists(file)).resolves.toBeFalsy()
  })
})
