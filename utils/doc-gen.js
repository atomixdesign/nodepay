require('console-stamp')(console, 'HH:MM:ss.l');
const fs = require('fs')
const path = require('path')
const ncp = require('ncp').ncp
const { execSync } = require('child_process');
const glob = require('glob')

function generateDocs() {
  console.log('Generating package docs')
  execSync('yarn run build:docs', (err, stdout /*, stderr */) => {
    if (err) {
      throw new Error(err)
      process.exit(1)
    }
  });
}

async function aggregate() {
  console.log('Copying package docs to top-level')
  let copyPromises = []

  const lernaConfig = require('../lerna.json')

  lernaConfig.packages.map(package => {
    const basePath = path.resolve(process.cwd(), 'docs')
    fs.rmdirSync(basePath, { recursive: true })
    fs.mkdirSync(basePath)

    const files = glob.sync(package)
    copyPromises = copyPromises.concat(files.map((filePath) =>
      new Promise((resolve, reject) => {
        const packagePath = path.resolve(process.cwd(), filePath)
        const packageName = path.basename(packagePath)
        fs.mkdirSync(path.resolve(basePath, packageName))
        ncp(
          path.resolve(packagePath, 'docs'),
          path.resolve(basePath, packageName),
          function (err) {
            if (err) reject(err)
            resolve(packageName)
          }
        )
      })
    ))
  })

  return await Promise.all(copyPromises)
}

function makeNavbar(packageList) {
  console.log('Generating sidebar')
  content = ''

  packageList.forEach(packageName => {
    content += `* [${packageName}](${packageName}/globals.md)\n`
  })

  const basePath = path.resolve(process.cwd(), 'docs')
  try {
    fs.writeFileSync(path.resolve(basePath, '_navbar.md'), content)
  } catch (error) {
    throw new Error(error)
    process.exit(1)
  }
}

function docsify() {
  console.log('Docsifying')
  execSync('docsify init ./docs', (err, stdout, stderr) => {
    if (err) {
      throw new Error(err)
      process.exit(1)
    }
  });
  // Custom docsify template
  fs.copyFileSync(
    path.resolve(process.cwd(), 'utils/docsify/index.html'),
    path.resolve(process.cwd(), 'docs/index.html'),
  )
}

generateDocs();
aggregate().then((packageNames) => {
  console.log(packageNames)
  makeNavbar(packageNames);
  docsify();
});
