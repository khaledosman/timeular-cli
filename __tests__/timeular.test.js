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
    it('exits with code 1 without any argument', async () => {
      const { code } = await cli([], '.')
      expect(code).toBe(1)
    })

    it('prints help to stdout without any argument', async () => {
      const { stderr: result } = await cli([], '.')
      const { stdout: help } = await cli(['help'], '.')
      expect(result.trim()).toEqual(help.trim())
    })
  })

  describe('help', () => {
    it('returns the same for -h and --help', async () => {
      const { stdout: resultH } = await cli(['-h'], '.')
      const { stdout: resultHelp } = await cli(['--help'], '.')
      expect(resultH).toEqual(resultHelp)
    })

    it('returns the same for -h and help', async () => {
      const { stdout: resultH } = await cli(['-h'], '.')
      const { stdout: resultHelp } = await cli(['help'], '.')
      expect(resultH).toEqual(resultHelp)
    })

    it('returns usage info to stdout', async () => {
      const { stdout: result } = await cli(['help'], '.')
      expect(result).toContain('Usage: timeular <command> [options]')
    })

    it('returns command info to stdout', async () => {
      const expectedCommands = ['timeular start [activityName]', 'timeular stop', 'timeular list', 'timeular status']
      const { stdout: result } = await cli(['help'], '.')
      expect(result).toContain('Commands:')
      const commands = result.replace(/\n/g, ' ').replace(/^.*Commands:/, '').split(/\s(\s)+/)
      expectedCommands.forEach(command => {
        expect(commands).toContain(command)
      })
    })
  })

  describe('version', () => {
    test('-v outputs the version to stdout', async () => {
      const { stdout: result } = await cli(['-v'], '.')
      expect(result).toContain(version)
    })

    test('--version outputs the version to stdout', async () => {
      const { stdout: result } = await cli(['--version'], '.')
      expect(result).toContain(version)
    })
  })
})
