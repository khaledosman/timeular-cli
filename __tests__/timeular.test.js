const path = require('path')
const exec = require('child_process').exec
const { version } = require('../package.json')

const cli = (args, cwd) => {
  return new Promise(resolve => {
    exec(`node ${path.resolve('./timeular')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      })
  })
}

describe('Application Tests', () => {
  describe('General', () => {
    it('exits with code 0 without any argument', async () => {
      const result = await cli([], '.')
      expect(result.code).toBe(0)
    })

    it('prints help to stdout without any argument', async () => {
      const result = await cli([], '.')
      const help = await cli(['help'], '.')
      expect(result.stdout).toEqual(help.stdout)
    })
  })

  describe('help', () => {
    it('returns the same for -h and --help', async () => {
      const resultH = await cli(['-h'], '.')
      const resultHelp = await cli(['--help'], '.')
      expect(resultH.stdout).toEqual(resultHelp.stdout)
    })

    it('returns the same for -h and help', async () => {
      const resultH = await cli(['-h'], '.')
      const resultHelp = await cli(['help'], '.')
      expect(resultH.stdout).toEqual(resultHelp.stdout)
    })

    it('returns usage info to stdout', async () => {
      const result = await cli(['help'], '.')
      expect(result.stdout).toContain('Usage: timeular [options] [command]')
    })

    it('returns command info to stdout', async () => {
      const expectedCommands = ['track [activityName]', 'report [options]', 'stop']
      const result = await cli(['help'], '.')
      expect(result.stdout).toContain('Commands:')
      const commands = result.stdout.replace(/\n/g, ' ').replace(/^.*Commands:/, '').split(/\s(\s)+/)
      expectedCommands.forEach(command => {
        expect(commands).toContain(command)
      })
    })
  })

  describe('version', () => {
    test('-v outputs the version to stdout', async () => {
      const result = await cli(['-v'], '.')
      expect(result.stdout).toContain(version)
    })

    test('--version outputs the version to stdout', async () => {
      const result = await cli(['--version'], '.')
      expect(result.stdout).toContain(version)
    })
  })
})
