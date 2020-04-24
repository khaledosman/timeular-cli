const { getCLIVersion } = require('../../helpers/get-cli-version')
const { version } = require('../../package.json')

describe('getCLIVersion()', () => {
  it('returns the version from package.json', () => {
    expect(getCLIVersion(5)).toEqual(version)
  })
})
