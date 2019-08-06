
async function getCLIVersion () {
  const packageJson = require('../package.json')
  return packageJson.version
}

module.exports.getCLIVersion = getCLIVersion
