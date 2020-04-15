const { getCLIVersion } = require('../../helpers/get-cli-version')
const { version } = require('../../package.json')

describe('getCLIVersion()', () => {
  it('returns the version from package.json', async () => {
    await expect(getCLIVersion(5)).resolves.toEqual(version)
  })
})
