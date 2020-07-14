const path = require('path')
const fs = require('fs')
const glob = require('glob')
const mkdirp = require('mkdirp')
const mustache = require('mustache')

function loadConfig(relativePath) {
  const cwd = process.cwd()
  return require(path.resolve(cwd, relativePath))
}

module.exports = {
  command: 'adapter:create',
  aliases: ['c'],
  desc: 'Create an adapter for a payment gateway',
  builder: (args) => {
    return args
      .positional('adapter-name', {
        description: 'An identifier for the gateway/module',
        type: 'string',
        required: true,
      })
  },
  handler: (argv) => {
    // retrieve args
    const adapterName = argv._[1]
    if (adapterName === undefined) {
      throw new Error('Missing required adapter name')
    }
    // retrieve app version, app prefix, package directory
    const monorepoInfo = loadConfig('./lerna.json')

    // build template params
    const { version, packages } = monorepoInfo
    const params = {
      packageName: `${process.env['LIB_PREFIX']}/${adapterName}`,
      packageVersion: version,
    }
    console.log(params)

    // Retrieve template structure
    const templatePath = path.relative(process.cwd(), process.env['LIB_TEMPLATE'])
    const packageRoot = path.resolve(packages[0].replace(/(\*+)$/, ''))
    const packageDir = path.resolve(packages[0].replace(/(\*+)$/, adapterName))

    const stripTemplateDirFunc = filePath => filePath.replace(process.env['LIB_TEMPLATE'], '')
    const globPattern = `${templatePath}/**/*`
    const inputDirs = glob
      .sync(`${globPattern}/`)
      .map(stripTemplateDirFunc)

    const inputFiles = glob
      .sync(globPattern, { nodir: true })
      .map(stripTemplateDirFunc)

    console.log(inputDirs)
    console.log(inputFiles)

    // Create destination
    const made = mkdirp.sync(packageDir)

    // Reproduce directory structure
    inputDirs.forEach(inputDir => {
      mkdirp.sync(path.join(packageDir,inputDir))
    })

    // For each file
    inputFiles.forEach(inputFile => {
      const mustacheExp = /\.mustache$/
      const isMustache = mustacheExp.test(inputFile)

      // Read and transform template
      if (isMustache) {
        const template = fs.readFileSync(path.join(templatePath, inputFile), 'utf-8')
        const output = mustache.render(template.toString(), params)
        fs.writeFileSync(
          path.join(packageDir,inputFile.replace(mustacheExp, '')),
          output,
        )
        // Or pass file through
      } else {
        fs.copyFileSync(
          path.join(templatePath, inputFile),
          path.join(packageDir,inputFile),
        )
      }
    })

    // recursively copy files there, but if they are `.mustache`, process them as template
  }
}
